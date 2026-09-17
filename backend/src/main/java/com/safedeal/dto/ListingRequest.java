package com.safedeal.dto;

import com.safedeal.enums.Category;
import com.safedeal.enums.ConditionType;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class ListingRequest {
    private String title;
    private String description;
    private Category category;
    private BigDecimal price;
    private ConditionType conditionType;
    private boolean billAvailable;
    private MultipartFile image;      // photo upload
}