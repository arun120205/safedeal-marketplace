package com.safedeal.service;

import com.safedeal.entity.*;
import com.safedeal.enums.*;
import com.safedeal.repository.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final DisputeRepository disputeRepo;
    private final OrderRepository orderRepo;
    private final ListingRepository listingRepo;
    private final UserRepository userRepo;
    private final WalletTransactionRepository txnRepo;
    private final AgentLogRepository agentLogRepo;
    private final GeminiService gemini;

    // ═══════════════ AGENT 2: DISPUTE RESOLVER 🤖 ═══════════════
    public Map<String, Object> investigateDispute(Long disputeId) {

        // ── TOOL 1: dispute + order facts
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));
        Order order = dispute.getOrder();

        // ── TOOL 2: buyer history
        List<Order> buyerOrders = orderRepo.findByBuyerIdOrderByCreatedAtDesc(order.getBuyer().getId());
        List<Dispute> buyerPastDisputes = disputeRepo.findByRaisedById(order.getBuyer().getId());

        // ── TOOL 3: seller history
        List<Order> sellerSales = orderRepo.findBySellerIdOrderByCreatedAtDesc(order.getSeller().getId());

        // ── TOOL 4: payment ledger for this order
        List<WalletTransaction> ledger = txnRepo.findByOrderId(order.getId());

        // ── TOOL 5: AI Vision analyzes the evidence image
        String evidenceAnalysis = "NO_EVIDENCE_IMAGE";
        if (dispute.getEvidenceUrl() != null && !dispute.getEvidenceUrl().isEmpty()) {
            evidenceAnalysis = gemini.analyzeImage(dispute.getEvidenceUrl(),
                    "This image is dispute evidence in an e-commerce escrow case. "
                            + "In 2-3 sentences: what does the image show, and does it look like genuine "
                            + "product-damage evidence or a fake/irrelevant image?");
        }

        // ── BUILD FACT SHEET → Gemini reasons over it
        String prompt = """
                You are a dispute-resolution assistant for an escrow marketplace.
                Analyze the case facts and return ONLY valid JSON (no markdown, no code fences):
                {"recommendation":"REFUND_BUYER or RELEASE_SELLER or NEED_MORE_EVIDENCE",
                 "confidence":"HIGH or MEDIUM or LOW",
                 "reasoning":"2-3 sentences citing the facts",
                 "riskFlags":["list of any suspicious patterns"]}

                CASE FACTS:
                - Order #%d | product: %s | amount: Rs.%s | order status: %s
                - Dispute reason: %s | description: "%s"
                - Payment: Razorpay-verified & locked in escrow (signature validated)
                - Ledger entries: %d rows
                - Buyer: %d total orders, %d past disputes
                - Seller: %d sales on platform
                - Evidence image analysis: %s
                """.formatted(
                order.getId(), order.getListing().getTitle(), order.getAmount(),
                order.getStatus(), dispute.getReason(), dispute.getDescription(),
                ledger.size(), buyerOrders.size(), buyerPastDisputes.size(),
                sellerSales.size(), evidenceAnalysis);

        String aiText = gemini.generateText(prompt);

        // ── Parse strict JSON from AI
        JSONObject verdict = new JSONObject(extractJson(aiText));
        List<String> flags = new ArrayList<>();
        JSONArray flagArr = verdict.optJSONArray("riskFlags");
        if (flagArr != null) for (int i = 0; i < flagArr.length(); i++) flags.add(flagArr.getString(i));

        // ── AUDIT LOG (every AI decision is recorded!)
        agentLogRepo.save(AgentLog.builder()
                .agentType("DISPUTE_AGENT").referenceId(disputeId)
                .inputSummary(prompt).verdict(verdict.optString("recommendation"))
                .confidence(verdict.optString("confidence"))
                .reasoning(verdict.optString("reasoning"))
                .riskFlags(String.join(", ", flags))
                .build());

        return Map.of(
                "agent", "DisputeResolver",
                "disputeId", disputeId,
                "recommendation", verdict.optString("recommendation"),
                "confidence", verdict.optString("confidence"),
                "reasoning", verdict.optString("reasoning"),
                "riskFlags", flags,
                "evidenceAnalysis", evidenceAnalysis,
                "note", "Human-in-the-loop: ADMIN decides via /api/disputes/admin/{id}/resolve");
    }

    // ═══════════════ AGENT 1: LISTING GUARDIAN 🛡️ ═══════════════
    public Map<String, Object> guardListing(String sellerEmail, String title, String description,
                                            Category category, BigDecimal price, String imageUrl) {

        // ── TOOL 1: market price data from OUR database
        List<Listing> sameCategory = listingRepo.findByCategoryAndStatus(category, ListingStatus.SOLD);
        BigDecimal avgPrice = BigDecimal.ZERO;
        if (!sameCategory.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (Listing l : sameCategory) sum = sum.add(l.getPrice());
            avgPrice = sum.divide(new BigDecimal(sameCategory.size()), 2, RoundingMode.HALF_UP);
        }

        // ── TOOL 2: AI Vision checks the product image
        String imageCheck = (imageUrl == null || imageUrl.isEmpty())
                ? "NO_IMAGE_PROVIDED"
                : gemini.analyzeImage(imageUrl,
                "Is this a genuine product photo for a second-hand marketplace listing? "
                        + "Answer in 1-2 sentences. Flag memes, screenshots, watermarks from other "
                        + "e-commerce sites, or inappropriate content.");

        // ── TOOL 3: AI text + price reasoning (single call)
        String prompt = """
                You are a fraud-detection agent for a second-hand marketplace.
                Analyze this listing and return ONLY valid JSON (no markdown):
                {"verdict":"APPROVE or FLAG or REJECT",
                 "reason":"1-2 sentences",
                 "riskFlags":["list any red flags"]}

                REJECT if: scam pattern, abusive text, or price absurdly wrong.
                FLAG if: slightly suspicious. APPROVE if: normal listing.

                LISTING:
                - Title: "%s"
                - Description: "%s"
                - Category: %s | Asking price: Rs.%s
                - Market average for %s (from %d sold listings): Rs.%s
                - Image check: %s
                """.formatted(title, description, category, price,
                category, sameCategory.size(), avgPrice, imageCheck);

        String aiText = gemini.generateText(prompt);
        JSONObject result = new JSONObject(extractJson(aiText));

        List<String> flags = new ArrayList<>();
        JSONArray flagArr = result.optJSONArray("riskFlags");
        if (flagArr != null) for (int i = 0; i < flagArr.length(); i++) flags.add(flagArr.getString(i));

        // ── AUDIT LOG
        agentLogRepo.save(AgentLog.builder()
                .agentType("LISTING_GUARDIAN").referenceId(0L)
                .inputSummary("[" + sellerEmail + "] " + title + " @ Rs." + price)
                .verdict(result.optString("verdict"))
                .confidence("AUTO").reasoning(result.optString("reason"))
                .riskFlags(String.join(", ", flags))
                .build());

        return Map.of(
                "agent", "ListingGuardian",
                "verdict", result.optString("verdict"),
                "reason", result.optString("reason"),
                "riskFlags", flags,
                "marketAvgPrice", avgPrice,
                "imageCheck", imageCheck);
    }

    // ── ADMIN audit trail view (for GET /api/agent/logs)
    public List<AgentLog> findTop20() {
        return agentLogRepo.findTop20ByOrderByCreatedAtDesc();
    }

    // ── helper: strip markdown fences Gemini sometimes adds
    private String extractJson(String text) {
        String t = text.replace("```json", "").replace("```", "").trim();
        int start = t.indexOf('{');
        int end = t.lastIndexOf('}');
        if (start == -1 || end == -1) throw new RuntimeException("AI returned non-JSON: " + text);
        return t.substring(start, end + 1);
    }
}