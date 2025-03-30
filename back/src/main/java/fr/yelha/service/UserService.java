package fr.yelha.service;

import fr.yelha.dto.UserDto;
import fr.yelha.model.User;
import fr.yelha.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

    public UserDto createUser(UserDto userDto) {
        User user = new User();
        updateUserFromDto(user, userDto);
        return convertToDto(userRepository.save(user));
    }

    public UserDto loginUser(UserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        if (!user.getPassword().equals(userDto.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }
        user.setLastLogin(LocalDateTime.now());
        return convertToDto(userRepository.save(user));
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
    }

    public UserDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        updateUserFromDto(user, userDto);
        return convertToDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto updatePassword(Long id, String oldPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        if (!user.getPassword().equals(oldPassword)) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }
        user.setPassword(newPassword);
        return convertToDto(userRepository.save(user));
    }

    public UserDto verifyEmail(Long id, String token) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        user.setEmailVerified(true);
        return convertToDto(userRepository.save(user));
    }

    public void resetPassword(Long id, String email) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        if (!user.getEmail().equals(email)) {
            throw new IllegalArgumentException("Email incorrect");
        }
        user.setPassword("resetpassword");
        userRepository.save(user);
    }

    public void updateLastLogin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    private void updateUserFromDto(User user, UserDto dto) {
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setActive(dto.isActive());
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setActive(user.isActive());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
} 