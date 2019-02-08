package com.shzlw.poli.rest;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/jdbcdatasource")
public class JdbcDataSourceWs {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<JdbcDataSource> all() {
        return jdbcDataSourceDao.fetchAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public JdbcDataSource one(@PathVariable("id") long id) {
        return jdbcDataSourceDao.fetchById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody JdbcDataSource ds) {
        long id = jdbcDataSourceDao.add(ds);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody JdbcDataSource ds) {
        jdbcDataSourceDao.update(ds);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        jdbcDataSourceDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/ping/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public String ping(@PathVariable("id") long id) {
        JdbcDataSource ds = jdbcDataSourceDao.fetchFullById(id);
        return jdbcQueryService.ping(ds);
    }
}
