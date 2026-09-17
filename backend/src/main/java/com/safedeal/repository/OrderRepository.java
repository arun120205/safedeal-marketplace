package com.safedeal.repository;

import com.safedeal.entity.Order;
import com.safedeal.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;          // ← ADD THIS LINE!
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<Order> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Order> findByStatusAndAutoReleaseAtBefore(OrderStatus status, LocalDateTime time);   // ⏰ new!
}