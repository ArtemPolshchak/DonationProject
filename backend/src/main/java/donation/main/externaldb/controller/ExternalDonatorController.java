package donation.main.externaldb.controller;

import donation.main.externaldb.entity.ExternalDonatorEntity;
import donation.main.externaldb.service.ExternalDonatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/second-donators")
@RequiredArgsConstructor
public class ExternalDonatorController {
    private final ExternalDonatorService donatorService;

    @GetMapping("/")
    public ResponseEntity<Iterable<ExternalDonatorEntity>> getAllPersons() {
        return ResponseEntity.status(HttpStatus.OK).body(donatorService.readAll());
    }
}
