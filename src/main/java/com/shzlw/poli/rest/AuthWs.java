package com.shzlw.poli.rest;

import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import com.shzlw.poli.util.PasswordUtil;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthWs {

    @Autowired
    UserDao userDao;

    @RequestMapping(value="/login/user", method = RequestMethod.POST)
    @Transactional
    public String loginByUser(@RequestBody User user, HttpServletResponse response) {
        String username = user.getUsername();
        String password = user.getPassword();

        User existUser = userDao.findByUsernameAndPassword(username, password);
        if (existUser == null) {
            return "error";
        }

        String sessionKey = PasswordUtil.getUniqueId();
        userDao.updateSessionKey(existUser.getId(), sessionKey);

        Cookie sessionKeyCookie = new Cookie(Constants.SESSION_KEY, sessionKey);
        sessionKeyCookie.setMaxAge(Constants.COOKIE_TIMEOUT);
        sessionKeyCookie.setPath("/");
        response.addCookie(sessionKeyCookie);

        return existUser.getSysRole();
    }

    @RequestMapping(value="/login/cookie", method= RequestMethod.POST)
    @Transactional
    public String loginBySessionKey(@CookieValue(value = Constants.SESSION_KEY, defaultValue = "") String sessionKey) {
        if (sessionKey.isEmpty()) {
            return "error";
        }

        User user = userDao.findBySessionKey(sessionKey);
        if (user == null) {
            return "error";
        }
        return user.getSysRole();
    }

    @RequestMapping(value="/logout", method= RequestMethod.GET)
    @Transactional
    public void logout(@CookieValue(Constants.SESSION_KEY) String sessionKey, HttpServletResponse response) throws IOException {
        User user = userDao.findBySessionKey(sessionKey);
        if (user != null) {
            userDao.updateSessionKey(user.getId(), null);

            Cookie sessionKeyCookie = new Cookie(Constants.SESSION_KEY, "");
            sessionKeyCookie.setMaxAge(0);
            sessionKeyCookie.setPath("/");
            response.addCookie(sessionKeyCookie);
        }
    }
}
