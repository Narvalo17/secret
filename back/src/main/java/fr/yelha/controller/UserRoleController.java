package fr.yelha.controller;

import fr.yelha.model.User;
import fr.yelha.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "API pour la gestion des utilisateurs")
public class UserRoleController {

    private final UserRepository userRepository;

    @Operation(summary = "Obtenir le rôle d'un utilisateur", description = "Récupère le rôle d'un utilisateur par son ID")
    @ApiResponse(responseCode = "200", description = "Rôle trouvé")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @GetMapping("/{id}/role")
    public ResponseEntity<Map<String, String>> getUserRole(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, String> response = new HashMap<>();
            response.put("role", user.getRole().name());
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.notFound().build();
    }
} 