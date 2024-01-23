package donation.main.controller;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import donation.main.service.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerController {

    private final ServerService service;

    @GetMapping("/")
    public ResponseEntity<Iterable<ServerEntity>> getAllServers() {
        return ResponseEntity.status(HttpStatus.OK).body(service.readAll());
    }

    @GetMapping("/server-names")
    public ResponseEntity<List<ServerIdNameDto>> getAllServerNames() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllServersNames());
    }

    @PostMapping
    public ResponseEntity<ServerEntity> createServer(@RequestBody CreateServerDto serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createServer(serverDto));
    }

    @PostMapping("/create-donator-bonus")
    public ResponseEntity<ServerEntity> createDonatorsBonusOnServer(@RequestBody CreateDonatorBonusOnServer serverDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDonatorsBonusOnServer(serverDto));
    }
//    @PatchMapping
//    public ResponseEntity<ServerEntity> updateServer()
}
