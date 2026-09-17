package com.safedeal.controller;

import com.safedeal.dto.OrderRequest;
import com.safedeal.dto.ShipRequest;
import com.safedeal.entity.Order;
import com.safedeal.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping   // buyer creates order
    public ResponseEntity<?> create(@RequestBody OrderRequest request, Authentication authentication) {
        try {
            return ResponseEntity.ok(orderService.createOrder(authentication.getName(), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public Order getOne(@PathVariable Long id) { return orderService.getOrder(id); }

    @GetMapping("/my-purchases")
    public List<Order> purchases(Authentication authentication) {
        return orderService.myPurchases(authentication.getName());
    }

    @GetMapping("/my-sales")
    public List<Order> sales(Authentication authentication) {
        return orderService.mySales(authentication.getName());
    }
    // SELLER ships
    @PutMapping("/{id}/ship")
    public ResponseEntity<?> ship(@PathVariable Long id, @RequestBody ShipRequest request,
                                  Authentication authentication) {
        try {
            return ResponseEntity.ok(orderService.shipOrder(id, authentication.getName(),
                    request.getTrackingNumber()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DEV: simulate courier delivery (real world: courier webhook)
    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliver(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.markDelivered(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // BUYER confirms → money released
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id, Authentication authentication) {
        try {
            return ResponseEntity.ok(orderService.confirmAndRelease(id, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}