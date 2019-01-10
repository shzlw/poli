package com.shzlw.poli.rest;

import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Widget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ws/widget")
public class WidgetWs {

    @Autowired
    WidgetDao widgetDao;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Widget one(@PathVariable("id") long id) {
        return widgetDao.fetchById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Widget widget) {
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

    public void runQuery() {

    }
}
