package donation.main.controller;

import jakarta.validation.Valid;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.ImageResponseDto;
import donation.main.dto.transactiondto.TransactionConfirmRequestDto;
import donation.main.dto.transactiondto.TransactionImageDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.TransactionSpecDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.enumeration.TransactionState;
import donation.main.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATOR')")
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary = "get all transactions")
    @GetMapping()
    public ResponseEntity<Page<TransactionResponseDto>> getAll(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.getAll(pageable));
    }

    @Operation(summary = "get all transactions from one Donator")
    @GetMapping("/donators/{id}")
    public ResponseEntity<Page<TransactionResponseDto>> findAllByDonatorId(@PathVariable Long id, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.findAllTransactionsByDonatorId(id, page));
    }

    @Operation(summary = "search transaction")
    @GetMapping("/search")
    public ResponseEntity<Page<TransactionResponseDto>> search(
            TransactionSpecDto specDto, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.search(specDto, page));
    }

    @Operation(summary = "create new transaction")
    @PostMapping
    public ResponseEntity<TransactionResponseDto> create(@Valid @RequestBody CreateTransactionDto formDto) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.create(formDto));
    }

    @Operation(summary = "update an existing transaction")
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponseDto> update(
            @PathVariable Long transactionId, @RequestBody UpdateTransactionDto transactionDto) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.updateTransaction(transactionId, transactionDto));
    }

    @Operation(summary = "setup currens TransactionState to new one state")
    @PutMapping("/{transactionId}/confirm")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TransactionResponseDto> confirmTransaction(
            @PathVariable Long transactionId, @RequestBody TransactionConfirmRequestDto dto) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.changeState(transactionId, dto));
    }

    @Operation(summary = "return full size transaction image")
    @GetMapping("/{transactionId}/img")
    public ResponseEntity<ImageResponseDto> getImage(@PathVariable Long transactionId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(transactionService.getImage(transactionId));
    }
}
