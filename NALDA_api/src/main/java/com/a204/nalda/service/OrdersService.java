package com.a204.nalda.service;

import com.a204.nalda.domain.entity.airplane.Flight;
import com.a204.nalda.domain.entity.airplane.Seat;
import com.a204.nalda.domain.entity.inflightservice.*;
import com.a204.nalda.domain.entity.user.User;
import com.a204.nalda.domain.enumtype.Status;
import com.a204.nalda.dto.orders.OrderDto;
import com.a204.nalda.dto.orders.OrderListDto;
import com.a204.nalda.dto.orders.ServiceCntDto;
import com.a204.nalda.dto.orders.ServiceDto;
import com.a204.nalda.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final ServiceRepository serviceRepository;
    private final OrderRepository orderRepository;
    private final OrderListRepository orderListRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final ServiceStockRepository serviceStockRepository;

    @Transactional
    public List<ServiceDto> servicesByClass(String serviceClass) throws IOException {
        List<ServiceCodes> services = serviceRepository.findByServiceClass(serviceClass);
        List<ServiceDto> serviceDto = new ArrayList<>();
        ByteArrayOutputStream bos;
        String fileName;
        String filePath;
        for (ServiceCodes service : services) {
            bos = new ByteArrayOutputStream();
            fileName = service.getImage();
            filePath = System.getProperty("user.dir") + "/src/main/resources/static/snack/";
            InputStream imageStream = new FileInputStream(filePath + fileName);
            imageStream.transferTo(bos);
            byte[] bytesData = bos.toByteArray();

            serviceDto.add(ServiceDto.builder()
                    .image(service.getImage())
                    .serviceName(service.getServiceName())
                    .serviceCode(service.getCode())
                    .serviceClass(service.getServiceClass())
                    .bytesdata(bytesData)
                    .build());
        }
        return serviceDto;
    }

    @Transactional
    public void orderInput(OrderDto orderdto) {

        Long userId = userRepository.findTopByUsername(orderdto.getUsername()).getId();
        User user = User.builder()
                .id(userId)
                .build();
        Long flightId = flightRepository.findTopByFlightNumOrderByIdDesc(orderdto.getFlightNum()).getId();
        Flight flight = Flight.builder()
                .id(flightId)
                .build();
        Long seatId = seatRepository.findTopBySeatNum(orderdto.getSeatNum()).getId();
        Seat seat = Seat.builder()
                .id(seatId)
                .build();
        Status status = Status.valueOf(orderdto.getStatus());

        Orders orders = Orders.builder()
                .orderMessage(orderdto.getOrderMessage())
                .orderTime(orderdto.getOrderTime())
                .flight(flight)
                .seat(seat)
                .user(user)
                .status(status)
                .ordersCodes(new ArrayList<>())
                .build();
        System.out.println(orders.getOrderMessage());
        for (OrderListDto orderList : orderdto.getOrderList()) {

            OrdersCodes ordersCodes = OrdersCodes.builder()
                    .orderCode(orderList.getOrderCode())
                    .cnt(orderList.getCnt())
                    .build();
            orders.addOrdersCode(ordersCodes);
        }
        orderRepository.save(orders);

    }

    public List<ServiceCntDto> serviceCnt(String flightNum){

        Long flightId = flightRepository.findTopByFlightNumOrderByIdDesc(flightNum).getId();
        List<ServiceStock> serviceStocks = serviceStockRepository.findByFlightId(flightId);
        List<ServiceCntDto> serviceCntDTOS = new ArrayList<>();
        for(ServiceStock serviceStock : serviceStocks){
            Long serviceCodeId = serviceStockRepository.findById(serviceStock.getId()).get().getServiceCodes().getId();
            String serviceCode = serviceRepository.findById(serviceCodeId).get().getCode();
            serviceCntDTOS.add(ServiceCntDto.builder()
                            .flightNum(flightNum)
                            .serviceCode(serviceCode)
                            .total(serviceStock.getTotal())
                            .build());
        }
        return serviceCntDTOS;

    }


    @Transactional
    public void serviceCntInput(List<ServiceCntDto> serviceCntDTOS) {

        for (ServiceCntDto serviceCntDto : serviceCntDTOS) {
            Long serviceCodeId = serviceRepository.findByServiceCode(serviceCntDto.getServiceCode()).getId();
            ServiceCodes serviceCodes = ServiceCodes.builder()
                    .id(serviceCodeId)
                    .build();
            Long flightId = flightRepository.findTopByFlightNumOrderByIdDesc(serviceCntDto.getFlightNum()).getId();
            Flight flight = Flight.builder()
                    .id(flightId)
                    .build();
            ServiceStock serviceStock = ServiceStock.builder()
                    .serviceCodes(serviceCodes)
                    .flight(flight)
                    .total(serviceCntDto.getTotal())
                    .build();
            serviceStockRepository.save(serviceStock);
        }
    }
    @Transactional
    public void updateServiceCnt(List<ServiceCntDto> serviceCntDTOS){
        for (ServiceCntDto serviceCntDto : serviceCntDTOS) {
            Long serviceCodeId = serviceRepository.findByServiceCode(serviceCntDto.getServiceCode()).getId();
            Long flightId = flightRepository.findTopByFlightNumOrderByIdDesc(serviceCntDto.getFlightNum()).getId();
            Long serviceStockId = serviceStockRepository.findByFlightAndServiceCode(flightId,serviceCodeId).getId();
            Optional<ServiceStock> optional = serviceStockRepository.findById(serviceStockId);
            ServiceStock serviceStock = optional.get();
            serviceStock.changeTotal(serviceCntDto.getTotal());
        }
    }



    @Transactional
    public List<ServiceDto> listService() {

        List<ServiceCodes> serviceCodes = serviceRepository.findAll();
        List<ServiceDto> serviceDto = new ArrayList<>();
        for (ServiceCodes serviceCode : serviceCodes) {
            serviceDto.add(ServiceDto.builder()
                    .image("")
                    .serviceName(serviceCode.getServiceName())
                    .serviceCode(serviceCode.getCode())
                    .serviceClass(serviceCode.getServiceClass())
                    .build());
        }
        return serviceDto;
    }


    @Transactional
    public List<OrderDto> listOrders(String flightNum) {
        Long flightId = flightRepository.findTopByFlightNumOrderByIdDesc(flightNum).getId();
        List<Orders> orders = orderRepository.findByFlightId(flightId);
        List<OrderDto> orderDTOS = new ArrayList<>();
        for (Orders order : orders) {
            List<OrdersCodes> ordersCodes = orderListRepository.findByOrdersId(order.getId());
            List<OrderListDto> orderLists = new ArrayList<>();
            for(OrdersCodes ordersCode: ordersCodes){
                orderLists.add(OrderListDto.builder()
                        .orderCode(ordersCode.getOrderCode())
                        .orderName(serviceRepository.findByServiceCode(ordersCode.getOrderCode()).getServiceName())
                        .cnt(ordersCode.getCnt())
                        .build());
            }
            String serviceClass;
            if(orderLists.get(0).getOrderCode().charAt(0)=='A'){
                serviceClass = "SNACK&DRINK";
            }else{
                serviceClass = serviceRepository.findByServiceCode(orderLists.get(0).getOrderCode()).getServiceClass();
            }
            orderDTOS.add(OrderDto.builder()
                    .id(order.getId())
                    .classification(serviceClass)
                    .orderMessage(order.getOrderMessage())
                    .orderTime(order.getOrderTime())
                    .flightNum(flightNum)
                    .seatNum(order.getSeat().getSeatNum())
                    .username(order.getUser().getUsername())
                    .status(String.valueOf(order.getStatus()))
                    .orderList(orderLists)
                    .build());
        }
        return orderDTOS;
    }

    @Transactional
    public void updateStatus(Long ordersId) {
        Optional<Orders> optional = orderRepository.findById(ordersId);
        if(optional.get().getStatus().equals(Status.PROGRESS)){
            optional.get().changeStatusInfo(Status.DONE);
        }else{
            optional.get().changeStatusInfo(Status.PROGRESS);
        }
    }
}