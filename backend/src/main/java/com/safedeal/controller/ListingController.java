package com.safedeal.controller;

import com.safedeal.dto.ListingRequest;
import com.safedeal.entity.Listing;
import com.safedeal.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    // SELLER: post a product (🤖 Agent Guardian checks it automatically!)
    @PostMapping
    public ResponseEntity<?> create(ListingRequest request, Authentication authentication) {
        try {
            return ResponseEntity.ok(listingService.createListing(authentication.getName(), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Browse: all AVAILABLE listings
    @GetMapping
    public List<Listing> browse() {
        return listingService.browseAvailable();
    }

    @GetMapping("/{id}")
    public Listing getOne(@PathVariable Long id) {
        return listingService.getListing(id);
    }

    // MY listings (needs token)
    @GetMapping("/my")
    public List<Listing> mine(Authentication authentication) {
        return listingService.myListings(authentication.getName());
    }

    // SELLER: delete (soft) own listing
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        try {
            listingService.deleteListing(authentication.getName(), id);
            return ResponseEntity.ok(Map.of("message", "Listing removed ✅"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}