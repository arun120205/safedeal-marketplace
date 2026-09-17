package com.safedeal.entity;

import com.safedeal.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;              // 🔒 the dynamic lock amount!

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal commission;          // 5%

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sellerPayout;        // 95%

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PAYMENT_PENDING;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String shippingAddress;
    private String trackingNumber;

    private LocalDateTime deliveredAt;
    private LocalDateTime autoReleaseAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}