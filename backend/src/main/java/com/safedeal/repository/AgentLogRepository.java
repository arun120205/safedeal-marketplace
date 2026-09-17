package com.safedeal.repository;

import com.safedeal.entity.AgentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentLogRepository extends JpaRepository<AgentLog, Long> {
    List<AgentLog> findTop20ByOrderByCreatedAtDesc();
}