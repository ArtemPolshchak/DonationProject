package donation.main.controller;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.UpdateDonatorsBonusOnServer;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import donation.main.service.ServerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import java.util.List;

@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerController {

    private final ServerService service;

    @Operation(summary = "get all servers")
    @GetMapping("/")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Iterable<ServerEntity>> getAllServers() {
        return ResponseEntity.status(HttpStatus.OK).body(service.readAll());
    }

    @Operation(summary = "get all servers by names")
    @GetMapping("/server-names")
    public ResponseEntity<Page<ServerIdNameDto>> getAllServerNames(Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllServersNames(page));
    }

    @Operation(summary = "create new server")
    @PostMapping
    public ResponseEntity<ServerEntity> createServer(@RequestBody CreateServerDto serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createServer(serverDto));
    }

    @Operation(summary = "create bonuses for donators on server")
    @PostMapping("/create-donator-bonus")
    public ResponseEntity<ServerEntity> createDonatorsBonusOnServer(@RequestBody CreateDonatorBonusOnServer serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDonatorsBonusOnServer(serverDto));
    }

    @Operation(summary = "update bonuses for donators on server")
    @PutMapping("/update-donator-bonus")
    public ResponseEntity<ServerEntity> updateDonatorsBonusOnServer(@RequestBody UpdateDonatorsBonusOnServer serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.updateDonatorsBonusOnserver(serverDto));
    }

    @Operation(summary = "Get all donators and their bonuses for a specific server with pagination")
    @GetMapping("/{serverId}/donator-bonus")
    public ResponseEntity<Page<DonatorBonusDto>> getDonatorsBonusesByServerId(
            @PathVariable Long serverId,
            @PageableDefault(sort = {"email"}, direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<DonatorBonusDto> donatorsBonuses = service.findDonatorsBonusesByServerId(serverId, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donatorsBonuses);
    }

    @GetMapping("/{serverId}/donator-search")
    public ResponseEntity<Page<DonatorBonusDto>> searchDonatorsByEmailContains(
            @PathVariable Long serverId,
            @RequestParam(required = false) String email,
            @PageableDefault(sort = {"email"}, direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<DonatorBonusDto> donatorsPage = service.searchDonatorsByEmailContains(serverId, email, pageable);
        return ResponseEntity.ok(donatorsPage);
    }

//    @PatchMapping
//    public ResponseEntity<ServerEntity> updateServer()
}
