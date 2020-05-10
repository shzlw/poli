package com.shzlw.poli.filter;

import com.shzlw.poli.dto.SharedLinkInfo;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.SharedReportService;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import com.shzlw.poli.util.HttpUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

@Component
@Order(1)
public class AuthFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    UserService userService;

    @Autowired
    SharedReportService sharedReportService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getServletPath();

        if (!path.startsWith("/ws/")) {
            chain.doFilter(request, response);
            return;
        }

        if (authBySessionKey(httpRequest, path)
            || authByApiKey(httpRequest, path)
            || authByShareKey(httpRequest, path)) {
            chain.doFilter(request, response);
            return;
        }

        return401(response);
    }

    private boolean authBySessionKey(HttpServletRequest httpRequest, String path) {
        String sessionKey = HttpUtils.getSessionKey(httpRequest);
        if (sessionKey == null) {
            return false;
        }

        User user = userService.getUserBySessionKey(sessionKey);
        if (user == null) {
            return false;
        }

        user.setSessionKey(sessionKey);
        httpRequest.setAttribute(Constants.HTTP_REQUEST_ATTR_USER, user);
        String sysRole = user.getSysRole();
        boolean isValid = false;
        if (Constants.SYS_ROLE_VIEWER.equals(sysRole)) {
            isValid = AuthFilterHelper.validateViewer(httpRequest.getMethod(), path);
        } else if (Constants.SYS_ROLE_DEVELOPER.equals(sysRole) || Constants.SYS_ROLE_ADMIN.equals(sysRole)) {
            isValid = true;
        } else {
            isValid = false;
        }
        return isValid;
    }

    private boolean authByApiKey(HttpServletRequest httpRequest, String path) {
        String apiKey = httpRequest.getHeader(Constants.HTTP_HEADER_API_KEY);
        if (apiKey == null) {
            return false;
        }

        User user = userService.getUserByApiKey(apiKey);
        if (user == null) {
            return false;
        }

        httpRequest.setAttribute(Constants.HTTP_REQUEST_ATTR_USER, user);
        return AuthFilterHelper.validateByApiKey(httpRequest.getMethod(), path);
    }

    private boolean authByShareKey(HttpServletRequest httpRequest, String path) {
        String shareKey = httpRequest.getHeader(Constants.HTTP_HEADER_SHARE_KEY);
        if (shareKey == null) {
            return false;
        }

        SharedLinkInfo linkInfo = sharedReportService.getSharedLinkInfoByShareKey(shareKey);
        if (linkInfo == null) {
            return false;
        }

        User user = linkInfo.getUser();
        if (user == null) {
            return false;
        }

        httpRequest.setAttribute(Constants.HTTP_REQUEST_ATTR_USER, user);
        return validateByShareKey(httpRequest.getMethod(), path, linkInfo, shareKey);
    }

    private static boolean validateByShareKey(String requestMethod, String path, SharedLinkInfo linkInfo, String shareKey) {
        if (linkInfo == null) {
            return false;
        }

        boolean isValid = false;
        long reportId = linkInfo.getReportId();
        Set<String> componentQueryUrls = linkInfo.getComponentQueryUrls();
        if (Constants.HTTP_METHOD_GET.equals(requestMethod)) {
            if (path.equals("/ws/reports/" + reportId)
                    || path.equals("/ws/components/report/" + reportId)
                    || path.equals("/ws/reports/sharekey/" + shareKey)) {
                isValid = true;
            }
        } else if (Constants.HTTP_METHOD_POST.equals(requestMethod)) {
            if (componentQueryUrls.contains(path)) {
                isValid = true;
            }
        }
        return isValid;
    }

    protected void return401(ServletResponse response) throws IOException {
        ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "The request is unauthorized.");
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
