package com.a204.nalda.repository;

import com.a204.nalda.domain.entity.inflightservice.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("select o from Orders o where o.flight.id = :flightId")
    List<Orders> findByFlightId(@Param("flightId") Long flightId);

    @Query("select o from Orders o where o.id = :ordersId")
    Optional<Orders> findById(@Param("ordersId") Long ordersId);

}
