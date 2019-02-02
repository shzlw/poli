package com.shzlw.poli.rest;

import com.shzlw.poli.dao.FilterDao;
import com.shzlw.poli.model.Filter;
import com.shzlw.poli.model.Widget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/filter")
public class FilterWs {

    @Autowired
    FilterDao filterDao;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Filter one(@PathVariable("id") long id) {
        return filterDao.fetchById(id);
    }

    @RequestMapping(value = "/dashboard/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Filter> allByDashboardId(@PathVariable("id") long id) {
        return filterDao.fetchAllByDashboardId(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Filter filter) {
        long id = filterDao.add(filter);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Filter filter) {
        // TODO:
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        filterDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
