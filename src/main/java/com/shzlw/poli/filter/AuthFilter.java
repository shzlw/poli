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
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getServletPath();

        LOGGER.info("filter: {}", path);
        if (path.startsWith("/ws/")) {
            String sessionKey = getSessionKey(httpRequest);
            if (sessionKey != null) {
                User user = userService.getOrCacheUser(sessionKey);
                if (user != null) {
                    String sysRole = user.getSysRole();
                    // TODO validate sys role and url
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
        String sessionKey = null;
        if (cookies != null) {
            for (int i = 0; i < cookies.length; i++) {
                String name = cookies[i].getName();
                String value = cookies[i].getValue();
                if (Constants.SESSION_KEY.equals(name)) {
                    return value;
                }
            }
        }
        return sessionKey;
    }

    @Override
    public void destroy() {

    }
}
