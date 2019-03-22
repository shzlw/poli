package com.shzlw.poli.rest;

import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthWs {

    @RequestMapping(value="/login/user", method = RequestMethod.POST)
    @Transactional
    public String login(@RequestBody User user, HttpServletResponse response) {
        return "";
    }

    @RequestMapping(value="/login/cookie", method= RequestMethod.POST)
    @Transactional
    public String webLogout(@CookieValue(Constants.SESSION_KEY) String sessionKey, HttpServletResponse response) throws IOException {
        return "";
    }
}
