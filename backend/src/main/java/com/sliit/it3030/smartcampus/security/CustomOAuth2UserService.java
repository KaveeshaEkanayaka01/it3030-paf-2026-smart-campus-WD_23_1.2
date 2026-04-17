package com.sliit.it3030.smartcampus.security;

import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Value("${app.admin.emails:}")
    private String adminEmails;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // Load user info from GitHub
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // ✅ Safe extraction of all attributes
        String githubId       = String.valueOf(attributes.get("id"));
        String githubUsername = (String) attributes.get("login");
        String avatarUrl      = (String) attributes.get("avatar_url");

        // ✅ Safe name extraction
        Object nameObj = attributes.get("name");
        String name = (nameObj != null && !nameObj.toString().trim().isEmpty())
                ? nameObj.toString()
                : githubUsername;   // fallback to username

        // ✅ Safe email extraction (GitHub email can be null/private)
        Object emailObj = attributes.get("email");
        String email = (emailObj != null && !emailObj.toString().trim().isEmpty())
                ? emailObj.toString()
                : githubUsername + "@github.com";  // fallback email

        log.info("GitHub OAuth login: username={}, email={}", githubUsername, email);

        // Check if user already exists in DB
        User user = userRepository.findByGithubId(githubId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        // Build set of configured admin emails (lowercased)
        Set<String> configuredAdmins = Arrays.stream(adminEmails == null ? new String[0] : adminEmails.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        if (user == null) {
            // ✅ New user - register them
            Set<String> roles = new HashSet<>();
            roles.add(User.ROLE_USER);

            // If this email is in configured admin list, grant admin role
            if (configuredAdmins.contains(email.toLowerCase())) {
                roles.add(User.ROLE_ADMIN);
                log.info("Assigning admin role to user: {}", email);
            }

            user = User.builder()
                    .githubId(githubId)
                    .githubUsername(githubUsername)
                    .name(name)
                    .email(email)
                    .avatarUrl(avatarUrl)
                    .roles(roles)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            log.info("New user registered via GitHub: {}", email);

        } else {
            // ✅ Existing user - update their info
            user.setGithubId(githubId);
            user.setGithubUsername(githubUsername);
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            user.setUpdatedAt(LocalDateTime.now());

            // If existing user lacks admin but email is in configured admin list, add it
            if (!user.getRoles().contains(User.ROLE_ADMIN) && configuredAdmins.contains(email.toLowerCase())) {
                user.getRoles().add(User.ROLE_ADMIN);
                log.info("Upgrading existing user to admin: {}", email);
            }

            log.info("Existing user logged in via GitHub: {}", email);
        }

        userRepository.save(user);

        return oAuth2User;
    }
}