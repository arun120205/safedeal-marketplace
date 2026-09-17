package com.safedeal.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long listingId;
    private String shippingAddress;
}