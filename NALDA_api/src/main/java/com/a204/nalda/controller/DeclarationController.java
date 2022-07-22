package com.a204.nalda.controller;

import com.a204.nalda.dto.customdeclaration.DeclarationDTO;
import com.a204.nalda.service.DeclarationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/declaration")
public class DeclarationController {

    private final DeclarationService declarationService;

    @PostMapping("/save")
    public ResponseEntity<?> saveDeclaration(@RequestBody DeclarationDTO declarationDTO) {
        Map<String,Object> result = new HashMap<>();
        try {
            declarationService.saveDeclaration(declarationDTO);
//            System.out.println("declarationDTO = " + declarationDTO);
            result.put("msg", "세관신고서가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "세관신고서 저장에 실패했습니다.");
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}