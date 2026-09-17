package com.safedeal.service;

import com.safedeal.dto.DisputeRequest;
import com.safedeal.entity.*;
import com.safedeal.enums.*;
import com.safedeal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final OrderService orderService;
    private final WalletService walletService;

    // BUYER raises dispute (within inspection window)
    @Transactional
    public Dispute raiseDispute(Long orderId, String buyerEmail, DisputeRequest req) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyer().getEmail().equals(buyerEmail))
            throw new RuntimeException("Only the BUYER can raise a dispute!");
        if (order.getStatus() != OrderStatus.DELIVERED)
            throw new RuntimeException("Disputes only allowed after DELIVERED (before release)!");

        Dispute dispute = Dispute.builder()
                .order(order)
                .raisedBy(userRepo.findByEmail(buyerEmail).orElseThrow())
                .reason(req.getReason())
                .description(req.getDescription())
                .evidenceUrl(req.getEvidenceUrl())
                .build();

        order.setStatus(OrderStatus.DISPUTED);   // ⏸️ blocks auto-release!
        orderRepo.save(order);

        return disputeRepo.save(dispute);
    }

    // ADMIN sees open disputes
    public List<Dispute> openDisputes() {
        return disputeRepo.findByStatusOrderByCreatedAtAsc(DisputeStatus.OPEN);
    }

    // ADMIN verdict: refund buyer OR release seller
    @Transactional
    public Map<String, Object> resolve(Long disputeId, String adminEmail, boolean refundBuyer) {
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        if (dispute.getStatus() != DisputeStatus.OPEN)
            throw new RuntimeException("Dispute already resolved!");
        if (!userRepo.findByEmail(adminEmail).orElseThrow().getRole().equals(Role.ADMIN))
            throw new RuntimeException("ADMIN only!");

        Order order = dispute.getOrder();

        if (refundBuyer) {
            // REFUND 💸 — buyer gets money back in wallet
            order.setStatus(OrderStatus.REFUNDED);
            orderRepo.save(order);
            walletService.addTxn(order.getBuyer(), order, TxnType.REFUND,
                    order.getAmount(), "Refund — dispute #" + disputeId);
            dispute.setStatus(DisputeStatus.RESOLVED_REFUND);
            dispute.setResolvedBy(adminEmail);
        } else {
            // RELEASE — seller wins, gets money
            orderService.releaseMoney(order);
            dispute.setStatus(DisputeStatus.RESOLVED_RELEASE);
            dispute.setResolvedBy(adminEmail);
        }

        disputeRepo.save(dispute);
        return Map.of(
                "message", refundBuyer ? "Refunded to buyer 💸" : "Released to seller 💰",
                "disputeId", disputeId,
                "orderStatus", order.getStatus().name());
    }
}