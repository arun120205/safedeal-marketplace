package com.safedeal.repository;

import com.safedeal.entity.Dispute;
import com.safedeal.enums.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByStatusOrderByCreatedAtAsc(DisputeStatus status);
    List<Dispute> findByRaisedById(Long userId);
}