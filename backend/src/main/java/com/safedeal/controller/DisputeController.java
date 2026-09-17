package com.safedeal.controller;

import com.safedeal.dto.DisputeRequest;
import com.safedeal.entity.Dispute;
import com.safedeal.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping("/order/{orderId}")   // BUYER raises
    public ResponseEntity<?> raise(@PathVariable Long orderId, @RequestBody DisputeRequest request,
                                   Authentication authentication) {
        try {
            return ResponseEntity.ok(disputeService.raiseDispute(orderId,
                    authentication.getName(), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin/open")         // ADMIN views
    public List<Dispute> open() { return disputeService.openDisputes(); }

    @PutMapping("/admin/{id}/resolve") // ADMIN verdict
    public ResponseEntity<?> resolve(@PathVariable Long id,
                                     @RequestParam boolean refundBuyer,
                                     Authentication authentication) {
        try {
            return ResponseEntity.ok(disputeService.resolve(id, authentication.getName(), refundBuyer));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}