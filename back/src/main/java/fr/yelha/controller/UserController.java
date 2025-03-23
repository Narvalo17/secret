package fr.yelha.controller;

import fr.yelha.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Operation(summary = "Create a user", tags = {"User Management"})
    @PostMapping(value = "/create")
    @ResponseBody
    public ResponseEntity<String> createUser(@RequestHeader HttpHeaders headers,
                                             @RequestBody User user, BearerTokenAuthentication authentication) {
        log.debug("User Service[post] : create user ");
        return ResponseEntity.ok().body("success");
    }

    @Operation(summary = "update a user", tags = {"User Management"})
    @PutMapping(value = "/update")
    @ResponseBody
    public ResponseEntity<String> updateUser(@RequestHeader HttpHeaders headers,
                                             @RequestBody User user, BearerTokenAuthentication authentication) {
        log.debug("User Service[put] : update user ");
        return ResponseEntity.ok().body("success");
    }

    @Operation(summary = "reset a user password", tags = {"User Management"})
    @PutMapping(value = "/reset/password")
    @ResponseBody
    public ResponseEntity<String> resetPassword(@RequestHeader HttpHeaders headers,
                                                @RequestBody User user) {
        log.debug("User Service[put] : reset user password ");
        return ResponseEntity.ok().body("success");
    }

    @Operation(summary = "Login to application", tags = {"Login"}, responses = {
            @ApiResponse(responseCode = "200", description = "Login ok"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/login")
    @ResponseBody
    public ResponseEntity<String> login(
            @Valid @RequestBody User user,
            @RequestHeader HttpHeaders headers,
            HttpServletRequest request) {
        log.debug("User Service[post] : login");

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON)
                .body("");
    }

    @Operation(summary = "Logout to application", tags = {"Login"}, responses = {
            @ApiResponse(responseCode = "204", description = "Logout ok"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/logout")
    @ResponseBody
    public ResponseEntity<String> logout(@Valid @RequestBody String token, @RequestHeader HttpHeaders headers) {
        log.debug("Admin back for front Service[post] : logout ");

        return ResponseEntity.status(HttpStatus.NO_CONTENT).contentType(MediaType.APPLICATION_JSON)
                .body("");
    }
}
