package com.safedeal.service;

import com.razorpay.RazorpayClient;
import com.safedeal.dto.OrderRequest;
import com.safedeal.entity.*;
import com.safedeal.enums.*;
import com.safedeal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final ListingRepository listingRepo;
    private final UserRepository userRepo;
    private final WalletService walletService;
    private final RazorpayClient razorpayClient;   // from RazorpayConfig bean

    @Value("${razorpay.key_secret}")
    private String keySecret;

    // ---------- 1. CREATE ORDER (buyer clicks Buy) ----------
    public Map<String, Object> createOrder(String buyerEmail, OrderRequest req) {

        User buyer = userRepo.findByEmail(buyerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Listing listing = listingRepo.findById(req.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != ListingStatus.AVAILABLE)
            throw new RuntimeException("Listing is not available!");
        if (listing.getSeller().getId().equals(buyer.getId()))
            throw new RuntimeException("You cannot buy your own product!");

        // ⚠️ SECURITY: price comes from DB — NEVER from frontend!
        BigDecimal amount = listing.getPrice();
        BigDecimal commission = amount.multiply(new BigDecimal("0.05"));
        BigDecimal payout = amount.subtract(commission);

        Order order = orderRepo.save(Order.builder()
                .listing(listing).buyer(buyer).seller(listing.getSeller())
                .amount(amount).commission(commission).sellerPayout(payout)
                .shippingAddress(req.getShippingAddress())
                .status(OrderStatus.PAYMENT_PENDING)
                .build());

        // create matching order inside Razorpay (amount in PAISE!)
        try {
            JSONObject options = new JSONObject();
            options.put("amount", amount.multiply(new BigDecimal(100)).intValue());
            options.put("currency", "INR");
            options.put("receipt", "ORD_" + order.getId());

            com.razorpay.Order rzpOrder = razorpayClient.orders.create(options);
            order.setRazorpayOrderId(rzpOrder.get("id"));
            orderRepo.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Razorpay order failed: " + e.getMessage());
        }

        return Map.of(
                "orderId", order.getId(),
                "razorpayOrderId", order.getRazorpayOrderId(),
                "amount", amount,
                "amountInPaise", amount.multiply(new BigDecimal(100)).intValue(),
                "status", order.getStatus().name());
    }

    // ---------- 2. VERIFY SIGNATURE → ESCROW LOCK 🔒 ----------
    @Transactional
    public Map<String, Object> verifyAndLock(String razorpayOrderId, String paymentId, String signature) {

        Order order = orderRepo.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // IDEMPOTENCY GUARD: one payment can only lock ONCE (no double credit!)
        if (order.getStatus() != OrderStatus.PAYMENT_PENDING)
            return Map.of("message", "Already processed ✅", "status", order.getStatus().name());

        // HMAC-SHA256 signature = mathematical proof the payment is real
        // Razorpay rule: signature = HMAC(order_id + "|" + payment_id, key_secret)
        String expectedSignature = hmacSha256(razorpayOrderId + "|" + paymentId, keySecret);
        boolean valid = expectedSignature.equals(signature);

        if (!valid)
            throw new RuntimeException("❌ Invalid signature — possible fraud! Payment NOT locked.");

        lockPayment(order, paymentId);

        return Map.of(
                "message", "Payment verified & LOCKED in escrow 🔒",
                "orderId", order.getId(),
                "status", order.getStatus().name(),
                "sellerNotice", "Payment Secured ✅ — Ship Now");
    }

    // ---------- 3. THE ESCROW LOCK ----------
    private void lockPayment(Order order, String paymentId) {
        order.setRazorpayPaymentId(paymentId);
        order.setStatus(OrderStatus.PAID_LOCKED);
        orderRepo.save(order);

        // mark product as sold
        Listing listing = order.getListing();
        listing.setStatus(ListingStatus.SOLD);
        listingRepo.save(listing);

        // LEDGER rows (the audit trail)
        walletService.addTxn(order.getBuyer(), order, TxnType.PAYMENT,
                order.getAmount(), "Paid order #" + order.getId());
        walletService.addTxn(order.getBuyer(), order, TxnType.LOCK,
                order.getAmount().negate(), "Locked in escrow 🔒");

        System.out.println("📩 SELLER NOTIFIED: Payment Secured ✅ — Ship order #" + order.getId());
    }

    // ---------- 4. DEV-ONLY: simulate a real Razorpay payment ----------
    public Map<String, Object> simulatePayment(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getStatus() != OrderStatus.PAYMENT_PENDING)
            throw new RuntimeException("Order already processed!");

        String fakePaymentId = "pay_SIM_" + System.currentTimeMillis();
        String signature = hmacSha256(order.getRazorpayOrderId() + "|" + fakePaymentId, keySecret);

        return verifyAndLock(order.getRazorpayOrderId(), fakePaymentId, signature);
    }

    // ---------- 5. SELLER SHIPS ----------
    @Transactional
    public Order shipOrder(Long orderId, String sellerEmail, String trackingNumber) {
        Order order = getOrder(orderId);

        if (!order.getSeller().getEmail().equals(sellerEmail))
            throw new RuntimeException("Only the SELLER can ship this order!");
        if (order.getStatus() != OrderStatus.PAID_LOCKED)
            throw new RuntimeException("Order is not in PAID_LOCKED state!");

        order.setTrackingNumber(trackingNumber);
        order.setStatus(OrderStatus.SHIPPED);
        return orderRepo.save(order);
    }

    // ---------- 6. SIMULATED DELIVERY (real world: courier webhook) ----------
    @Transactional
    public Order markDelivered(Long orderId) {
        Order order = getOrder(orderId);
        if (order.getStatus() != OrderStatus.SHIPPED)
            throw new RuntimeException("Order is not SHIPPED yet!");

        order.setStatus(OrderStatus.DELIVERED);
        order.setDeliveredAt(LocalDateTime.now());
        order.setAutoReleaseAt(LocalDateTime.now().plusHours(72));  // ⏰ the timer!
        return orderRepo.save(order);
    }

    // ---------- 7. BUYER CONFIRMS → MONEY RELEASED 💰 ----------
    @Transactional
    public Map<String, Object> confirmAndRelease(Long orderId, String buyerEmail) {
        Order order = getOrder(orderId);

        if (!order.getBuyer().getEmail().equals(buyerEmail))
            throw new RuntimeException("Only the BUYER can confirm receipt!");
        if (order.getStatus() != OrderStatus.DELIVERED)
            throw new RuntimeException("Order is not DELIVERED yet!");

        releaseMoney(order);
        return Map.of(
                "message", "Payment released to seller 💰",
                "orderId", order.getId(),
                "status", order.getStatus().name(),
                "sellerCredited", order.getSellerPayout());
    }

    // ---------- 8. THE ACTUAL MONEY RELEASE (shared logic) ----------
    @Transactional
    public void releaseMoney(Order order) {
        if (order.getStatus() != OrderStatus.DELIVERED) return;   // idempotency!

        order.setStatus(OrderStatus.RELEASED);
        orderRepo.save(order);

        // SELLER GETS PAID 💰 (wallet balance actually increases!)
        walletService.addTxn(order.getSeller(), order, TxnType.RELEASE,
                order.getSellerPayout(), "Sale credit — order #" + order.getId());
        walletService.addTxn(order.getSeller(), order, TxnType.COMMISSION,
                order.getCommission().negate(), "Platform fee 5%");

        System.out.println("💰 PLATFORM EARNED COMMISSION: ₹" + order.getCommission()
                + " from order #" + order.getId());
        System.out.println("✅ SELLER CREDITED: ₹" + order.getSellerPayout());
    }

    // ---------- 9. ⏰ AUTO-RELEASE TIMER (seller trust solution!) ----------
    @Scheduled(fixedRate = 60000)   // runs every 60 seconds (real world: hourly)
    public void autoReleaseStuckPayments() {
        List<Order> stuck = orderRepo.findByStatusAndAutoReleaseAtBefore(
                OrderStatus.DELIVERED, LocalDateTime.now());

        for (Order order : stuck) {
            System.out.println("⏰ AUTO-RELEASE: 72h passed, buyer silent → releasing ₹"
                    + order.getSellerPayout() + " to seller for order #" + order.getId());
            releaseMoney(order);
        }
    }

    // ---------- helpers ----------
    public Order getOrder(Long id) {
        return orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> myPurchases(String email) {
        User u = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findByBuyerIdOrderByCreatedAtDesc(u.getId());
    }

    public List<Order> mySales(String email) {
        User u = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findBySellerIdOrderByCreatedAtDesc(u.getId());
    }

    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("HMAC failed");
        }
    }
}