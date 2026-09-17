package com.safedeal.controller;

import com.safedeal.dto.VerifyPaymentRequest;
import com.safedeal.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    // REAL verification (Phase 6 frontend will call this)
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyPaymentRequest request) {
        try {
            return ResponseEntity.ok(orderService.verifyAndLock(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DEV-ONLY simulator (until checkout UI exists)
    @PostMapping("/simulate/{orderId}")
    public ResponseEntity<?> simulate(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(orderService.simulatePayment(orderId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}