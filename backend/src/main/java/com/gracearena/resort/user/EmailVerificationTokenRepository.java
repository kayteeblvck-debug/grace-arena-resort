package com.gracearena.resort.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

	Optional<EmailVerificationToken> findByToken(String token);

	/** Invalidates any outstanding link for a user before a fresh one is issued. */
	@Modifying
	@Query("delete from EmailVerificationToken t where t.userId = :userId and t.usedAt is null")
	void deleteUnusedByUserId(Long userId);
}
