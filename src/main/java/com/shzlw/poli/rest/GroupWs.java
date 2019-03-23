package com.shzlw.poli.rest;

import com.shzlw.poli.model.Group;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/ws/group")
public class GroupWs {

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Group> all() {
        return Collections.emptyList();
    }
}
