package com.shzlw.poli.rest;

import com.shzlw.poli.dao.DashboardDao;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
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
    UserDao userDao;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Dashboard> all(@CookieValue(Constants.SESSION_KEY) String sessionKey) {
        User user = userDao.findBySessionKey(sessionKey);
        List<Dashboard> dashboards = new ArrayList<>();
        if (Constants.SYS_ROLE_VIEWER.equals(user.getSysRole())) {
            dashboards = dashboardDao.findByViewer(user.getId());
        } else {
            dashboards = dashboardDao.findAll();
        }
        return dashboards;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard one(@PathVariable("id") long id) {
        Dashboard dashboard = dashboardDao.findById(id);
        return dashboard;
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard fetchOneByName(@PathVariable("name") String name) {
        Dashboard dashboard = dashboardDao.findByName(name);
        return dashboard;
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Dashboard dashboard) {
        long id = dashboardDao.insert(dashboard.getName(), dashboard.getStyle());
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Dashboard dashboard) {
        dashboardDao.update(dashboard);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        widgetDao.deleteByDashboardId(id);
        dashboardDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
