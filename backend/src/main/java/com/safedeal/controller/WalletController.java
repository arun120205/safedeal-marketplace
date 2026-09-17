package com.safedeal.controller;

import com.safedeal.entity.User;
import com.safedeal.repository.UserRepository;
import com.safedeal.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final UserRepository userRepo;
    private final WalletTransactionRepository txnRepo;

    @GetMapping
    public Map<String, Object> myWallet(Authentication authentication) {
        User user = userRepo.findByEmail(authentication.getName()).orElseThrow();
        return Map.of(
                "balance", user.getWalletBalance(),
                "transactions", txnRepo.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}