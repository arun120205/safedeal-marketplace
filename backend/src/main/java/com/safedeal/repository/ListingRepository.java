package com.safedeal.repository;

import com.safedeal.entity.Listing;
import com.safedeal.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status);
    List<Listing> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Listing> findByCategoryAndStatus(com.safedeal.enums.Category category,
                                          com.safedeal.enums.ListingStatus status);
}