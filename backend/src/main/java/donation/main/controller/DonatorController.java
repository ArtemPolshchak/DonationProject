package donation.main.controller;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import donation.main.service.DonatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/")
    public ResponseEntity<Iterable<DonatorEntity>> getAllPersons() {
        return ResponseEntity.status(HttpStatus.OK).body(donatorService.readAll());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DonatorEntity>> searchDonatorByMail(@RequestParam String mail, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(donatorService.findByMailPaginated(mail, pageable));
    }

    @PostMapping
    public ResponseEntity<DonatorEntity> createDonator(@RequestBody CreateDotatorDto dotatorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(donatorService.createDonator(dotatorDto));
    }
}
