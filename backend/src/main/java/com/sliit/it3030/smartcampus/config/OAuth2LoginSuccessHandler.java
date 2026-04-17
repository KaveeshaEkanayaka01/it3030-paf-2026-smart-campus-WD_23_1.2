package com.sliit.it3030.smartcampus.config;

import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.UserRepository;
import com.sliit.it3030.smartcampus.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            // ✅ Safe extraction
            String githubId = String.valueOf(attributes.get("id"));

            log.info("OAuth2 success - GitHub ID: {}", githubId);

            // Find user from DB
            User user = userRepository.findByGithubId(githubId)
                    .orElseThrow(() -> new RuntimeException(
                        "User not found after OAuth login - githubId: " + githubId
                    ));

            log.info("Found user: {}", user.getEmail());

            // Generate JWT
            String token = jwtService.generateToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRoles()
            );

            log.info("JWT generated successfully for user: {}", user.getEmail());

            // Redirect to frontend with token
            String redirectUrl = frontendUrl + "/auth/callback?token=" + token;
            log.info("Redirecting to: {}", redirectUrl);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            log.error("OAuth2 success handler error: ", e);
            // Redirect to login page with error
            getRedirectStrategy().sendRedirect(
                request, response, 
                frontendUrl + "/login?error=auth_failed"
            );
        }
    }
}