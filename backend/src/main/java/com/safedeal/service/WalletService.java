package com.safedeal.service;

import com.safedeal.entity.*;
import com.safedeal.enums.TxnType;
import com.safedeal.repository.WalletTransactionRepository;
import com.safedeal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletTransactionRepository txnRepo;
    private final UserRepository userRepo;

    /**
     * Records one money movement in the LEDGER.
     * RELEASE / REFUND / WITHDRAW → also change wallet balance.
     * PAYMENT / LOCK / COMMISSION → audit rows only (balance unchanged).
     */
    public void addTxn(User user, Order order, TxnType type, BigDecimal amount, String note) {

        txnRepo.save(WalletTransaction.builder()
                .user(user).order(order).type(type)
                .amount(amount).note(note)
                .build());

        switch (type) {
            case RELEASE, REFUND -> {
                user.setWalletBalance(user.getWalletBalance().add(amount));
                userRepo.save(user);
            }
            case WITHDRAW -> {
                user.setWalletBalance(user.getWalletBalance().subtract(amount));
                userRepo.save(user);
            }
            default -> { /* audit-only row */ }
        }
    }
}