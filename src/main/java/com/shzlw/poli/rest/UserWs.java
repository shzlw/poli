package com.shzlw.poli.rest;

import com.shzlw.poli.model.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/ws/user")
public class UserWs {

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<User> all() {
        return Collections.emptyList();
    }
}
