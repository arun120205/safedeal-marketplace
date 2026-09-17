package com.safedeal.controller;

import com.safedeal.entity.AgentLog;
import com.safedeal.repository.UserRepository;
import com.safedeal.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;
    private final UserRepository userRepo;

    // ADMIN: trigger AI investigation of a dispute
    @PostMapping("/disputes/{id}/investigate")
    public ResponseEntity<?> investigate(@PathVariable Long id, Authentication authentication) {
        try {
            if (!"ADMIN".equals(userRepo.findByEmail(authentication.getName())
                    .orElseThrow().getRole().name()))
                return ResponseEntity.status(403).body(Map.of("error", "ADMIN only!"));
            return ResponseEntity.ok(agentService.investigateDispute(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ADMIN: audit trail of every AI decision
    @GetMapping("/logs")
    public List<AgentLog> logs(Authentication authentication) {
        if (!"ADMIN".equals(userRepo.findByEmail(authentication.getName())
                .orElseThrow().getRole().name()))
            throw new RuntimeException("ADMIN only!");
        return agentService.findTop20();
    }
}