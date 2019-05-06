package com.shzlw.poli.rest;

import com.shzlw.poli.dao.DashboardDao;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.DashboardService;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import org.checkerframework.framework.qual.QualifierArgument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ws/dashboard")
public class DashboardWs {

    @Autowired
    DashboardDao dashboardDao;

    @Autowired
    WidgetDao widgetDao;

    @Autowired
    UserService userService;

    @Autowired
    DashboardService dashboardService;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Dashboard> findAll(@CookieValue(Constants.SESSION_KEY) String sessionKey) {
        User user = userService.getUser(sessionKey);
        user.setSessionKey(sessionKey);
        return dashboardService.getDashboardsByUser(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard findOneById(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                 @PathVariable("id") long id) {
        List<Dashboard> dashboards = findAll(sessionKey);
        return dashboards.stream().filter(d -> d.getId() == id).findFirst().get();
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard findOneByName(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                   @PathVariable("name") String name) {
        List<Dashboard> dashboards = findAll(sessionKey);
        return dashboards.stream().filter(d -> d.getName().equals(name)).findFirst().get();
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                    @RequestBody Dashboard dashboard) {
        dashboardService.invalidateCache(sessionKey);
        long id = dashboardDao.insert(dashboard.getName(), dashboard.getStyle());
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                    @RequestBody Dashboard dashboard) {
        dashboardService.invalidateCache(sessionKey);
        dashboardDao.update(dashboard);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                    @PathVariable("id") long id) {
        dashboardService.invalidateCache(sessionKey);
        widgetDao.deleteByDashboardId(id);
        dashboardDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
