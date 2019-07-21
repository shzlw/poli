package com.shzlw.poli.filter;

import com.shzlw.poli.model.User;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(1)
public class AuthFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    UserService userService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getServletPath();

        if (path.startsWith("/ws/")) {
            String sessionKey = getSessionKey(httpRequest);
            String sysRole = null;
            boolean isAuthByApiKey = false;
            if (sessionKey != null) {
                User user = userService.getUserBySessionKey(sessionKey);
                if (user != null) {
                    user.setSessionKey(sessionKey);
                    httpRequest.setAttribute(Constants.HTTP_REQUEST_ATTR_USER, user);
                    sysRole = user.getSysRole();
                }
            } else {
                String apiKey = httpRequest.getHeader(Constants.HTTP_HEADER_API_KEY);
                if (apiKey != null) {
                    User user = userService.getUserByApiKey(apiKey);
                    if (user != null) {
                        httpRequest.setAttribute(Constants.HTTP_REQUEST_ATTR_USER, user);
                        sysRole = user.getSysRole();
                        isAuthByApiKey = true;
                    }
                }
            }

            if (sysRole != null) {
                boolean isValid = false;
                if (isAuthByApiKey) {
                    // Authorized by using API key
                    isValid = validateByApiKey(httpRequest.getMethod(), path);
                } else {
                    // Authorized by using cookie.
                    if (Constants.SYS_ROLE_VIEWER.equals(sysRole)) {
                        isValid = validateViewer(httpRequest.getMethod(), path);
                    } else if (Constants.SYS_ROLE_DEVELOPER.equals(sysRole) || Constants.SYS_ROLE_ADMIN.equals(sysRole)) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                }

                if (isValid) {
                    chain.doFilter(request, response);
                } else {
                    return401(response);
                }
            } else {
                return401(response);
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    private static String getSessionKey(HttpServletRequest httpRequest) {
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies != null) {
            for (int i = 0; i < cookies.length; i++) {
                String name = cookies[i].getName();
                String value = cookies[i].getValue();
                if (Constants.SESSION_KEY.equals(name)) {
                    return value;
                }
            }
        }
        return null;
    }

    private static boolean validateViewer(String requestMethod, String path) {
        boolean isValid = false;
        if (Constants.HTTP_METHOD_GET.equals(requestMethod)) {
            if (path.startsWith("/ws/report")
                    || path.startsWith("/ws/cannedreport")
                    || path.startsWith("/ws/component/report/")
                    || path.startsWith("/ws/user/account")) {
                isValid = true;
            }
        } else if (Constants.HTTP_METHOD_PUT.equals(requestMethod)) {
            if (path.startsWith("/ws/user/account")) {
                isValid = true;
            }
        } else if (Constants.HTTP_METHOD_POST.equals(requestMethod)) {
            if (path.startsWith("/ws/jdbcquery")
                || path.startsWith("/ws/cannedreport")) {
                isValid = true;
            }
        } else if (Constants.HTTP_METHOD_DELETE.equals(requestMethod)) {
            if (path.startsWith("/ws/cannedreport")) {
                isValid = true;
            }
        }
        return isValid;
    }

    private static boolean validateByApiKey(String requestMethod, String path) {
        boolean isValid = false;
        if (Constants.HTTP_METHOD_GET.equals(requestMethod)) {
            if (path.startsWith("/ws/report")
                    || path.startsWith("/ws/cannedreport")
                    || path.startsWith("/ws/component/report/")) {
                isValid = true;
            }
        } else if (Constants.HTTP_METHOD_POST.equals(requestMethod)) {
            if (path.startsWith("/ws/jdbcquery/component")) {
                isValid = true;
            }
        }
        return isValid;
    }

    protected void return401(ServletResponse response) throws IOException {
        ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "The session key is not valid.");
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
