package fr.yelha.controller;

import fr.yelha.model.Statistic;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Validated
@Tag(name = "Statistiques", description = "API de gestion des statistiques")
public class StatisticController {

    @Operation(
        summary = "Obtenir les statistiques",
        description = "Récupération des statistiques selon les critères de filtrage"
    )
    @ApiResponse(responseCode = "200", description = "Liste des statistiques récupérée avec succès")
    @ApiResponse(responseCode = "400", description = "Paramètres de filtrage invalides")
    @GetMapping
    public ResponseEntity<List<Statistic>> getStatistiques(
            @Parameter(description = "Date de début de la période") 
            @RequestParam(required = false) LocalDate dateDebut,
            
            @Parameter(description = "Date de fin de la période") 
            @RequestParam(required = false) LocalDate dateFin,
            
            @Parameter(description = "Adresse du wallet") 
            @RequestParam(required = false) String walletAddress) {
        
        log.debug("Statistic Service[get] : getStatistiques");
        return ResponseEntity.ok(List.of(new Statistic()));
    }
}
