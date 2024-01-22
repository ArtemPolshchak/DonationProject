package donation.main.controllers;

import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.services.ServerBonusSettingsService;
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

    @GetMapping("/")
    public ResponseEntity<Iterable<ServerBonusSettingsEntity>> getAllServerBonuses() {
        return ResponseEntity.status(HttpStatus.OK).body(serverBonusSettingsService.readAll());
    }

    @PostMapping
    public ResponseEntity<Set<ServerBonusSettingsEntity>> createAll(@RequestBody List<CreateServerBonusesDto> entities, @RequestParam Long serverId) {
        return ResponseEntity.status(HttpStatus.OK).body(serverBonusSettingsService.replaceAll(entities, serverId));
    }

}
