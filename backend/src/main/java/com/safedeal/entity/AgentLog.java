package com.safedeal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AgentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agentType;        // DISPUTE_AGENT / LISTING_GUARDIAN
    private Long referenceId;        // dispute id or listing id
    @Column(columnDefinition = "TEXT")
    private String inputSummary;     // facts the agent saw
    private String verdict;          // recommendation
    private String confidence;
    @Column(columnDefinition = "TEXT")
    private String reasoning;
    private String riskFlags;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}