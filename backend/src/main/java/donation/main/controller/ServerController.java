package donation.main.controller;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.DonatorBonusOnServer;
import donation.main.dto.donatorsdto.UpdateDonatorsBonusOnServer;
import donation.main.dto.serverdto.ServerDto;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
@PreAuthorize("hasAuthority('ADMIN')")
public class ServerController {

    private final ServerService serverService;

    @Operation(summary = "get all servers")
    @GetMapping("/")
    public ResponseEntity<Page<ServerEntity>> getAllServers(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(serverService.getAll(pageable));
    }

    @Operation(summary = "get all servers by names")
    @GetMapping("/names")
    public ResponseEntity<Page<ServerIdNameDto>> getAllServerNames(Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(serverService.getAllServersNames(page));
    }

    @Operation(summary = "create new server")
    @PostMapping
    public ResponseEntity<ServerEntity> createServer(@RequestBody ServerDto serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serverService.create(serverDto));
    }

    @Operation(summary = "update server")
    @PatchMapping("/{serverId}")
    public ResponseEntity<Void> updateServer(@PathVariable Long serverId, @RequestBody ServerDto serverDto) {
        serverService.updateServer(serverId, serverDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "get server info by serverID")
    @GetMapping("/{serverId}")
    public ResponseEntity<ServerDto> getServerById(@PathVariable Long serverId) {
        return ResponseEntity.status(HttpStatus.OK).body(serverService.getServerById(serverId));
    }

    @Operation(summary = "get all bonuses from all servers for Donator by donatorID")
    @GetMapping("/donator-bonuses/{donatorId}")
    public ResponseEntity<List<DonatorBonusOnServer>> getDonatorsBonusesOnServers(@PathVariable Long donatorId) {
        return ResponseEntity.status(HttpStatus.OK).body(serverService.findAllBonusesOnServersByDonatorId(donatorId));
    }

    @Operation(summary = "create bonuses for donators on server")
    @PostMapping("/{serverId}/donators/{donatorId}/bonus")
    public ResponseEntity<ServerEntity> createDonatorsBonusOnServer(
            @PathVariable Long serverId,
            @PathVariable Long donatorId,
            @RequestBody CreateDonatorBonusOnServer dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serverService.createDonatorsBonusOnServer(serverId, donatorId, dto));
    }

    @Operation(summary = "update bonuses for donators on server")
    @PutMapping("/{serverId}/donators/{donatorId}/bonus")
    public ResponseEntity<ServerEntity> updateDonatorsBonusOnServer(
            @PathVariable Long serverId,
            @PathVariable Long donatorId,
            @RequestBody UpdateDonatorsBonusOnServer dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serverService.updateDonatorsBonusOnServer(serverId, donatorId, dto));
    }

    @Operation(summary = "Get all donators and their bonuses for a specific server with pagination")
    @GetMapping("/{serverId}/donators/bonus")
    public ResponseEntity<Page<DonatorBonusDto>> getDonatorsBonusesByServerId(
            @PathVariable Long serverId,
            @PageableDefault(sort = {"email"}, direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<DonatorBonusDto> donatorsBonuses = serverService.getAllDonatorBonusesByServerId(serverId, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donatorsBonuses);
    }

    @Operation(summary = "Find donator by email")
    @GetMapping("/{serverId}/donators/search")
    public ResponseEntity<Page<DonatorBonusDto>> searchDonatorsByEmailContains(
            @PathVariable Long serverId,
            @RequestParam(defaultValue = "")  String donatorMails,
            @PageableDefault(sort = {"email"}, direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<DonatorBonusDto> donatorsPage = serverService.searchDonatorsByEmailLike(serverId, donatorMails, pageable);
        return ResponseEntity.ok(donatorsPage);
    }

    @Operation(summary = "delete server by ID")
    @DeleteMapping("/{serverId}")
    public ResponseEntity<Void> deleteServerByID(@PathVariable Long serverId) {
        serverService.deleteServerById(serverId);
        return ResponseEntity.ok().build();
    }
}
