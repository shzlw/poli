package com.shzlw.poli.filter;

import com.shzlw.poli.model.User;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(1)
public class AuthFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    private static final String HTTP_METHOD_GET = "GET";
    private static final String HTTP_METHOD_POST = "POST";
    private static final String HTTP_METHOD_PUT = "PUT";
    private static final String HTTP_METHOD_DELETE = "DELETE";

    @Autowired
    UserService userService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getServletPath();

        if (path.startsWith("/ws/")) {
            String sessionKey = getSessionKey(httpRequest);
            String sysRole = null;
            if (sessionKey != null) {
                User user = userService.getUser(sessionKey);
                if (user != null) {
                    sysRole = user.getSysRole();
                }
            }

            if (sysRole != null) {
                boolean isValid = false;
                if (Constants.SYS_ROLE_VIEWER.equals(sysRole)) {
                    isValid = validateViewer(httpRequest.getMethod(), path);
                } else if (Constants.SYS_ROLE_DEVELOPER.equals(sysRole) || Constants.SYS_ROLE_ADMIN.equals(sysRole)) {
                    isValid = true;
                } else {
                    isValid = false;
                }

                if (isValid) {
                    chain.doFilter(request, response);
                }
            } else {
                ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "The session key is not valid.");
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    public String getSessionKey(HttpServletRequest httpRequest) {
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

    public boolean validateViewer(String requestMethod, String path) {
        boolean isValid = false;
        if (HTTP_METHOD_GET.equals(requestMethod)) {
            if (path.startsWith("/ws/dashboard")
                    || path.startsWith("/ws/widget/dashboard/")
                    || path.startsWith("/ws/user/account")) {
                isValid = true;
            }
        } else if (HTTP_METHOD_PUT.equals(requestMethod)) {
            if (path.startsWith("/ws/user/account")) {
                isValid = true;
            }
        } else if (HTTP_METHOD_POST.equals(requestMethod)) {
            if (path.startsWith("/ws/jdbcquery")) {
                isValid = true;
            }
        }
        return isValid;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
