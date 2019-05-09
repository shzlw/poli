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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
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
    DashboardService dashboardService;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Dashboard> findAll(HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        return dashboardService.getDashboardsByUser(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard findOneById(@PathVariable("id") long id,
                                 HttpServletRequest request) {
        List<Dashboard> dashboards = findAll(request);
        return dashboards.stream().filter(d -> d.getId() == id).findFirst().orElse(null);
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard findOneByName(@PathVariable("name") String name,
                                   HttpServletRequest request) {
        List<Dashboard> dashboards = findAll(request);
        return dashboards.stream().filter(d -> d.getName().equals(name)).findFirst().orElse(null);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Dashboard dashboard,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        dashboardService.invalidateCache(user.getId());
        long id = dashboardDao.insert(dashboard.getName(), dashboard.getStyle());
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Dashboard dashboard,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        dashboardService.invalidateCache(user.getId());
        dashboardDao.update(dashboard);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        dashboardService.invalidateCache(user.getId());
        widgetDao.deleteByDashboardId(id);
        dashboardDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
