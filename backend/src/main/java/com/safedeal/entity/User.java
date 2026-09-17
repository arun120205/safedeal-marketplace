package com.safedeal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.safedeal.enums.KycStatus;
import com.safedeal.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore                       // 🔐 never leak password in JSON!
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String phone;

    private String address;

    @JsonIgnore                       // 🔐 never leak KYC doc in JSON!
    private String idProofUrl;

    @Enumerated(EnumType.STRING)
    private KycStatus kycStatus;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder.Default
    private BigDecimal walletBalance = BigDecimal.ZERO;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}