package com.shzlw.poli.rest;

import com.shzlw.poli.dao.DashboardDao;
import com.shzlw.poli.dao.FilterDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.Filter;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/dashboard")
public class DashboardWs {

    @Autowired
    DashboardDao dashboardDao;

    @Autowired
    FilterDao filterDao;

    @Autowired
    WidgetDao widgetDao;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Dashboard> all() {
        return dashboardDao.fetchAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard one(@PathVariable("id") long id) {
        Dashboard dashboard = dashboardDao.fetchById(id);
        return dashboard;
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Dashboard fetchOneByName(@PathVariable("name") String name) {
        Dashboard dashboard = dashboardDao.fetchByName(name);
        return dashboard;
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Dashboard dashboard) {
        long id = dashboardDao.add(dashboard.getName(), dashboard.getStyle());
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
        filterDao.deleteByDashboardId(id);
        widgetDao.deleteByDashboardId(id);
        dashboardDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
