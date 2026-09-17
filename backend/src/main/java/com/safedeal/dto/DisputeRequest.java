package com.safedeal.dto;

import lombok.Data;

@Data
public class DisputeRequest {
    private String reason;      // NOT_RECEIVED / DAMAGED / OTHER
    private String description;
    private String evidenceUrl; // unboxing photo/video link
}