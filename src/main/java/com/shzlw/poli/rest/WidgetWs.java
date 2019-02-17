package com.shzlw.poli.rest;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/widget")
public class WidgetWs {

    @Autowired
    WidgetDao widgetDao;

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Widget one(@PathVariable("id") long id) {
        return widgetDao.fetchById(id);
    }

    @RequestMapping(value = "/dashboard/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Widget> allByDashboardId(@PathVariable("id") long id) {
        return widgetDao.fetchAllByDashboardId(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Widget widget) {
        widget.setX(0);
        widget.setY(0);
        widget.setWidth(200);
        widget.setHeight(200);
        widget.setType("table");
        long id = widgetDao.add(widget);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Widget widget) {
        // TODO:
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        widgetDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/position", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<?> updatePos(@RequestBody Widget widget) {
        widgetDao.updatePosition(widget);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
