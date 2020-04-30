package com.shzlw.poli.filter;

import com.shzlw.poli.dto.SharedLinkInfo;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.SharedReportService;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RunWith(MockitoJUnitRunner.class)
public class AuthFilterTest {

    @InjectMocks
    @Spy
    AuthFilter authFilter;

    @Mock
    UserService userService;

    @Mock
    SharedReportService sharedReportService;

    @Mock
    HttpServletRequest httpRequest;

    @Mock
    HttpServletResponse httpResponse;

    @Mock
    FilterChain chain;

    @Mock
    Cookie cookie;

    @Mock
    User user;

    @Mock
    FilterConfig filterConfig;

    @Mock
    SharedLinkInfo sharedLinkInfo;

    @Test
    public void testAccessNotProtectedResource() throws IOException, ServletException {
        Mockito.when(httpRequest.getServletPath()).thenReturn("/css");

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(chain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testNullCookie() throws IOException, ServletException {
        Cookie[] cookies = null;
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/reports");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(authFilter).return401(httpResponse);
    }

    @Test
    public void testNullSessionKey() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = null;
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/reports");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(authFilter).return401(httpResponse);
    }

    @Test
    public void testInvalidRole() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/reports");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn("invalid role");

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(authFilter).return401(httpResponse);
    }

    @Test
    public void testAdminAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/reports");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_ADMIN);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(chain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testDeveloperAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/reports");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_DEVELOPER);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(chain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testViewerInValidAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/jdbcdatasources");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_VIEWER);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(authFilter).return401(httpResponse);
    }

    @Test
    public void testViewerValidAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/cannedreports"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/components/report/"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/users/account"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/sharedreports/generate-sharekey"),
                new AccessRule(Constants.HTTP_METHOD_PUT, "/ws/users/account"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/cannedreports"),
                new AccessRule(Constants.HTTP_METHOD_POST, "Report"),
                new AccessRule(Constants.HTTP_METHOD_DELETE, "/ws/cannedreports")
        );

        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_VIEWER);

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(accessRules.size())).doFilter(httpRequest, httpResponse);
    }

    public void testViewerValidAccess_unauthorized() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = "123";

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/users/1"),
                new AccessRule(Constants.HTTP_METHOD_PUT, "/ws/reports"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/reports"),
                new AccessRule(Constants.HTTP_METHOD_DELETE, "/ws/reports")
        );

        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_VIEWER);

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(0)).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testApiKeyAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = null;
        String apiKey = "123";
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(httpRequest.getHeader(Constants.HTTP_HEADER_API_KEY)).thenReturn(apiKey);
        Mockito.when(userService.getUserByApiKey(apiKey)).thenReturn(user);

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/cannedreports"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/components/report/"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component")
        );

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(accessRules.size())).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testApiKeyAccess_unauthorized() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = null;
        String apiKey = "123";
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(httpRequest.getHeader(Constants.HTTP_HEADER_API_KEY)).thenReturn(apiKey);
        Mockito.when(userService.getUserByApiKey(apiKey)).thenReturn(user);

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/reports")
        );

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(0)).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testShareKeyAccess() throws IOException, ServletException {
        String shareKey = "123";
        long reportId = 1;
        Set<String> componentQueryUrls = new HashSet<>();
        for (int i = 1; i <= 3; i++) {
            componentQueryUrls.add("/ws/jdbcquery/component/" + i);
        }

        Mockito.when(httpRequest.getHeader(Constants.HTTP_HEADER_SHARE_KEY)).thenReturn(shareKey);
        Mockito.when(sharedReportService.getSharedLinkInfoByShareKey(shareKey)).thenReturn(sharedLinkInfo);
        Mockito.when(sharedLinkInfo.getUser()).thenReturn(user);
        Mockito.when(sharedLinkInfo.getReportId()).thenReturn(reportId);
        Mockito.when(sharedLinkInfo.getComponentQueryUrls()).thenReturn(componentQueryUrls);

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports/sharekey/" + shareKey),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports/" + reportId),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/components/report/" + reportId),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/1"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/2"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/3")
        );

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(accessRules.size())).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testShareKeyAccess_unauthorized() throws IOException, ServletException {
        String shareKey = "123";
        long reportId = 1;
        Set<String> componentQueryUrls = new HashSet<>();
        for (int i = 1; i <= 3; i++) {
            componentQueryUrls.add("/ws/jdbcquery/component/" + i);
        }

        Mockito.when(httpRequest.getHeader(Constants.HTTP_HEADER_SHARE_KEY)).thenReturn(shareKey);
        Mockito.when(sharedReportService.getSharedLinkInfoByShareKey(shareKey)).thenReturn(sharedLinkInfo);
        Mockito.when(sharedLinkInfo.getUser()).thenReturn(user);
        Mockito.when(sharedLinkInfo.getReportId()).thenReturn(reportId);
        Mockito.when(sharedLinkInfo.getComponentQueryUrls()).thenReturn(componentQueryUrls);

        List<AccessRule> accessRules = Arrays.asList(
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports/sharekey/456"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/reports/2"),
                new AccessRule(Constants.HTTP_METHOD_GET, "/ws/components/report/2"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/4"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/5"),
                new AccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery/component/6")
        );

        for (AccessRule rule : accessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(0)).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testInit() throws ServletException {
        authFilter.init(filterConfig);
    }

    @Test
    public void testDestroy() throws ServletException {
        authFilter.destroy();
    }

    private static class AccessRule {
        String method;
        String url;

        public AccessRule(String method, String url) {
            this.method = method;
            this.url = url;
        }
    }
}
