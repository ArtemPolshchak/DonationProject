package donation.main.controller;

import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.service.ServerBonusSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/server-bonus-settings")
@RequiredArgsConstructor
public class ServerBonusSettingsController {

    private final ServerBonusSettingsService serverBonusSettingsService;

    @Operation(summary = "get all bonuses from  servers")
    @GetMapping("/")
    public ResponseEntity<Iterable<ServerBonusSettingsEntity>> getAllServerBonuses() {
        return ResponseEntity.status(HttpStatus.OK).body(serverBonusSettingsService.readAll());
    }

    @Operation(summary = "create new bonuses if null otherwise recreate bonuses")
    @PostMapping
    public ResponseEntity<Set<ServerBonusSettingsEntity>> createOrRecreateBonuses(@RequestBody List<CreateServerBonusesDto> entities, @RequestParam Long serverId) {
        return ResponseEntity.status(HttpStatus.OK).body(serverBonusSettingsService.replaceAll(entities, serverId));
    }

}
