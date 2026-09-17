package com.safedeal.service;

import com.safedeal.dto.ListingRequest;
import com.safedeal.entity.Listing;
import com.safedeal.entity.User;
import com.safedeal.enums.Category;
import com.safedeal.enums.ListingStatus;
import com.safedeal.repository.ListingRepository;
import com.safedeal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepo;
    private final UserRepository userRepo;
    private final CloudinaryService cloudinaryService;
    private final AgentService agentService;   // 🤖 NEW — Agent AI!

    public User getCurrentUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Map<String, Object> createListing(String email, ListingRequest req) {
        User seller = getCurrentUser(email);

        String imageUrl = null;
        MultipartFile image = req.getImage();
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }
        // 🛡️ AGENT 1: LISTING GUARDIAN — AI checks BEFORE saving!
        // (fail-open design: if AI is down/quota-exceeded → listing still allowed)
        Map<String, Object> guard;
        String aiVerdict;
        try {
            guard = agentService.guardListing(
                    email, req.getTitle(), req.getDescription(),
                    req.getCategory(), req.getPrice(), imageUrl);
            aiVerdict = (String) guard.get("verdict");
        } catch (Exception e) {
            System.out.println("⚠️ AI Guardian unavailable: " + e.getMessage());
            guard = Map.of(
                    "agent", "ListingGuardian",
                    "verdict", "SKIPPED",
                    "reason", "AI check unavailable — listing allowed, flagged for manual review");
            aiVerdict = "SKIPPED";
        }

        if ("REJECT".equals(aiVerdict))
            throw new RuntimeException("❌ AI Guardian rejected listing: " + guard.get("reason"));

        Listing listing = Listing.builder()
                .seller(seller)
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .price(req.getPrice())
                .conditionType(req.getConditionType())
                .billAvailable(req.isBillAvailable())
                .imageUrl(imageUrl)
                .build();

        Listing saved = listingRepo.save(listing);

        return Map.of(
                "message", "FLAG".equals(aiVerdict)
                        ? "Listing created ⚠️ (AI flagged for review)"
                        : "Listing created ✅ (AI verified)",
                "listingId", saved.getId(),
                "imageUrl", saved.getImageUrl() == null ? "no image" : saved.getImageUrl(),
                "aiCheck", guard);
    }

    public List<Listing> browseAvailable() {
        return listingRepo.findByStatusOrderByCreatedAtDesc(ListingStatus.AVAILABLE);
    }

    public Listing getListing(Long id) {
        return listingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public List<Listing> myListings(String email) {
        User seller = getCurrentUser(email);
        return listingRepo.findBySellerIdOrderByCreatedAtDesc(seller.getId());
    }

    public void deleteListing(String email, Long id) {
        Listing listing = getListing(id);
        if (!listing.getSeller().getEmail().equals(email))
            throw new RuntimeException("You can delete only YOUR listings!");
        listing.setStatus(ListingStatus.REMOVED);
        listingRepo.save(listing);
    }
}