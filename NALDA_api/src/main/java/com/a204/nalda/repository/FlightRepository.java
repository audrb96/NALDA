package com.a204.nalda.repository;

import com.a204.nalda.domain.entity.airplane.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Flight findTopByFlightNumOrderByIdDesc(@Param("flightNum") String flightNum);

}
