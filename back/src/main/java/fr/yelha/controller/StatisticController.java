package fr.yelha.controller;

import fr.yelha.model.Statistic;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/statitic")
public class StatisticController {

    @ResponseBody
    @Operation(summary = "Get statistics between dates", tags = {"Statistics"}, responses = {
            @ApiResponse(responseCode = "200", description = "liste des statistiques"),
            @ApiResponse(responseCode = "400", description = "impossible de récupérer les données"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/all")
    public ResponseEntity<List<Statistic>> getStatistiques(@RequestParam(required = false) LocalDate dateDebut,
                                                           @RequestParam(required = false) LocalDate dateFin,
                                                           @RequestParam(required = false) String walletAddress,
                                                           @RequestHeader HttpHeaders headers) {

        log.debug("Statistic Service[get] : getStatistiques");
        return ResponseEntity.status(HttpStatus.OK)
                .body(List.of(new Statistic()));
    }
}
