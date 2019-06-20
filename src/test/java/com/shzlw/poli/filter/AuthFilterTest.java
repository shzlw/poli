package com.shzlw.poli.filter;

import com.shzlw.poli.model.User;
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
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class AuthFilterTest {

    @InjectMocks
    @Spy
    AuthFilter authFilter;

    @Mock
    UserService userService;

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

    @Test
    public void testAccessNotProtectedResource() throws IOException, ServletException {
        Mockito.when(httpRequest.getServletPath()).thenReturn("/css");

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(chain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testNullCookie() throws IOException, ServletException {
        Cookie[] cookies = null;
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(authFilter).return401(httpResponse);
    }

    @Test
    public void testNullSessionKey() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = null;
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
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
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
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
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
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
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
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
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/jdbcdatasource");
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

        List<ViewerAccessRule> viewerAccessRules = Arrays.asList(
                new ViewerAccessRule(Constants.HTTP_METHOD_GET, "/ws/report"),
                new ViewerAccessRule(Constants.HTTP_METHOD_GET, "/ws/cannedreport"),
                new ViewerAccessRule(Constants.HTTP_METHOD_GET, "/ws/component/report/"),
                new ViewerAccessRule(Constants.HTTP_METHOD_GET, "/ws/user/account"),
                new ViewerAccessRule(Constants.HTTP_METHOD_PUT, "/ws/user/account"),
                new ViewerAccessRule(Constants.HTTP_METHOD_POST, "/ws/jdbcquery"),
                new ViewerAccessRule(Constants.HTTP_METHOD_DELETE, "/ws/cannedreport")
        );

        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(userService.getUserBySessionKey(sessionKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_VIEWER);

        for (ViewerAccessRule rule : viewerAccessRules) {
            Mockito.when(httpRequest.getMethod()).thenReturn(rule.method);
            Mockito.when(httpRequest.getServletPath()).thenReturn(rule.url);

            authFilter.doFilter(httpRequest, httpResponse, chain);
        }

        Mockito.verify(chain, Mockito.times(viewerAccessRules.size())).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testApiKeyAccess() throws IOException, ServletException {
        Cookie[] cookies = new Cookie[1];
        cookies[0] = cookie;
        String sessionKey = null;
        String apiKey = "123";
        Mockito.when(httpRequest.getServletPath()).thenReturn("/ws/report");
        Mockito.when(httpRequest.getCookies()).thenReturn(cookies);
        Mockito.when(cookie.getName()).thenReturn(Constants.SESSION_KEY);
        Mockito.when(cookie.getValue()).thenReturn(sessionKey);
        Mockito.when(httpRequest.getHeader(Constants.HTTP_HEADER_API_KEY)).thenReturn(apiKey);
        Mockito.when(userService.getUserByApiKey(apiKey)).thenReturn(user);
        Mockito.when(user.getSysRole()).thenReturn(Constants.SYS_ROLE_ADMIN);

        authFilter.doFilter(httpRequest, httpResponse, chain);

        Mockito.verify(chain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void testInit() throws ServletException {
        authFilter.init(filterConfig);
    }

    @Test
    public void testDestroy() throws ServletException {
        authFilter.destroy();
    }

    private static class ViewerAccessRule {
        String method;
        String url;

        public ViewerAccessRule(String method, String url) {
            this.method = method;
            this.url = url;
        }
    }
}
