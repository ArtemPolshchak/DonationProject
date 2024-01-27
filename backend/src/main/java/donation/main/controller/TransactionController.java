package donation.main.controller;

import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.TransactionSpecDto;
import donation.main.entity.TransactionEntity;
import donation.main.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @Operation(summary = "get all transactions")
    @GetMapping()
    public ResponseEntity<Page<TransactionResponseDto>> getAll(Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getAll(page));
    }

//    @GetMapping("/search")
//    public ResponseEntity<Page<TransactionEntity>> getAllInProgress(@RequestParam TransactionState state, Pageable page) {
//        return ResponseEntity.status(HttpStatus.OK).body(service.findAllByState(state, page));
//    }

    @Operation(summary = "search transaction")
    @GetMapping("/search")
    public ResponseEntity<Page<TransactionEntity>> search(TransactionSpecDto specDto, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(service.search(specDto, page));
    }

    @Operation(summary = "create new transaction")
    @PostMapping
    public ResponseEntity<TransactionEntity> create(@RequestBody CreateTransactionDto formDto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.create(formDto));
    }
}
