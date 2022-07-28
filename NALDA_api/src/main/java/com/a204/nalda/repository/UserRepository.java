package com.a204.nalda.repository;

import com.a204.nalda.domain.entity.user.User;
import com.a204.nalda.dto.user.LoginDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {
    User findUserByUsername(String username);

    @Query("select new com.a204.nalda.dto.user.LoginDto(u.username,u.fullName,u.birthday) from User u where u.username = :username")
    List<LoginDto> findByUsername(String username);
}
