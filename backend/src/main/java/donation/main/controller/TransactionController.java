package donation.main.controller;

import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.TransactionSpecDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.entity.TransactionEntity;
import donation.main.enumeration.TransactionState;
import donation.main.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary = "get all transactions")
    @GetMapping()
    public ResponseEntity<Page<TransactionResponseDto>> getAll(Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getAll(page));
    }

    @Operation(summary = "get all transactions by State")
    @GetMapping("/state")
    public ResponseEntity<Page<TransactionResponseDto>> getAllTransactionsByState(@RequestParam TransactionState state, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.findAllByState(state, page));
    }

    @Operation(summary = "get all transactions from one Donator")
    @GetMapping("/donators")
    public ResponseEntity<Page<TransactionResponseDto>> findAllByDonatorId(@RequestParam Long id, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.findAllTransactionsByDonatorId(id, page));
    }

//    @GetMapping("/search")
//    public ResponseEntity<Page<TransactionEntity>> getAllInProgress(@RequestParam TransactionState state, Pageable page) {
//        return ResponseEntity.status(HttpStatus.OK).body(service.findAllByState(state, page));
//    }

    @Operation(summary = "search transaction")
    @GetMapping("/search")
    public ResponseEntity<Page<TransactionEntity>> search(TransactionSpecDto specDto, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.search(specDto, page));
    }

    @Operation(summary = "create new transaction")
    @PostMapping
    public ResponseEntity<TransactionEntity> create(@RequestBody CreateTransactionDto formDto) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.create(formDto));
    }

    @Operation(summary = "update an existing transaction")
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionEntity> updateTransaction(@PathVariable Long transactionId, @RequestBody UpdateTransactionDto transactionDto
    ) {
        TransactionEntity updateTransaction = transactionService.updateTransaction(transactionId, transactionDto);
        return ResponseEntity.status(HttpStatus.OK).body(updateTransaction);
    }

    @Operation(summary = "setup currens TransactionState to new one state")
    @PutMapping("/state/{transactionId}")
    public ResponseEntity<TransactionEntity> updateTransactionState(@PathVariable Long transactionId, @RequestParam TransactionState state
    ) {
        TransactionEntity updateTransactionState = transactionService.updateTransactionState(transactionId, state);
        return ResponseEntity.status(HttpStatus.OK).body(updateTransactionState);
    }
}
