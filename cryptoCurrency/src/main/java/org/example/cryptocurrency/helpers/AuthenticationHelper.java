package org.example.cryptocurrency.helpers;

import jakarta.servlet.http.HttpSession;
import org.example.cryptocurrency.exceptions.AuthenticationFailureException;
import org.example.cryptocurrency.exceptions.AuthorizationException;
import org.example.cryptocurrency.exceptions.EntityNotFoundException;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import java.util.Base64;

@Component
public class AuthenticationHelper {
    private static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    private static final String INVALID_AUTHENTICATION_ERROR = "Invalid authentication.";

    private final UserAccountService userAccountService;

    @Autowired
    public AuthenticationHelper(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }
    public UserAccount tryGetUser(HttpHeaders headers) {
        String userInfo = headers.getFirst(AUTHORIZATION_HEADER_NAME);
        if (userInfo == null || !userInfo.startsWith("Basic ")) {
            throw new AuthorizationException(INVALID_AUTHENTICATION_ERROR);
        }

        try {
            String base64Credentials = userInfo.substring("Basic ".length());
            String credentials = new String(Base64.getDecoder().decode(base64Credentials));
            String[] values = credentials.split(":", 2);

            if (values.length != 2) {
                throw new AuthorizationException(INVALID_AUTHENTICATION_ERROR);
            }

            String username = values[0];
            String password = values[1];
            UserAccount user = userAccountService.findByUsername(username);
            if (!user.getPassword().equals(password)) {
                throw new AuthorizationException(INVALID_AUTHENTICATION_ERROR);
            }
            return user;
        } catch (EntityNotFoundException e) {
            throw new AuthorizationException(INVALID_AUTHENTICATION_ERROR);
        }
    }
    public UserAccount tryGetCurrentUser(HttpSession session) {
        Object currentUser = session.getAttribute("currentUser");
        if (!(currentUser instanceof UserAccount)) {
            throw new AuthorizationException("Invalid authentication. Please log in.");
        }
        return (UserAccount) currentUser;
    }
    public UserAccount throwIfWrongAuthentication(String username, String password) {
        UserAccount user;
        try {
            user = userAccountService.findByUsername(username);
        } catch (EntityNotFoundException e) {
            throw new AuthenticationFailureException("Wrong username or password.");
        }
        if (!user.getPassword().equals(password)) {
            throw new AuthenticationFailureException("Wrong username or password.");
        }
        return user;
    }
}
