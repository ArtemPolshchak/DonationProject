package donation.main.controller;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import donation.main.service.DonatorService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donators")
@RequiredArgsConstructor
public class DonatorController {

    private final DonatorService donatorService;

    @Operation(summary = "get all donators")
    @GetMapping("/")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DonatorEntity>> getAllDonators(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(donatorService.findAllBy(pageable));
    }

    @Operation(summary = "find donator by donators email")
    @GetMapping("/search")
    public ResponseEntity<Page<DonatorEntity>> searchDonatorByMail(@RequestParam String mail, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(donatorService.findByMailPaginated(mail, pageable));
    }

    @Operation(summary = "create new donator")
    @PostMapping
    public ResponseEntity<DonatorEntity> createDonator(@RequestBody CreateDotatorDto dotatorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(donatorService.createDonator(dotatorDto));
    }
}
