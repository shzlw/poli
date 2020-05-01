package com.shzlw.poli.rest;

import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.SavedQueryDao;
import com.shzlw.poli.dto.Table;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.List;

@RestController
@RequestMapping("/ws/jdbcdatasources")
public class JdbcDataSourceWs {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

    @Autowired
    ComponentDao componentDao;

    @Autowired
    SavedQueryDao savedQueryDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<JdbcDataSource> findAll() {
        return jdbcDataSourceDao.findAllWithNoCredentials();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public JdbcDataSource one(@PathVariable("id") long id) {
        return jdbcDataSourceDao.findByIdWithNoCredentials(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody JdbcDataSource ds) {
        long id = jdbcDataSourceDao.insert(ds);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody JdbcDataSource ds) {
        jdbcDataSourceService.removeFromCache(ds.getId());
        jdbcDataSourceDao.update(ds);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        jdbcDataSourceService.removeFromCache(id);
        componentDao.updateByDataSourceId(id);
        savedQueryDao.clearDataSourceId(id);
        jdbcDataSourceDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/ping/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public String ping(@PathVariable("id") long id) {
        JdbcDataSource ds = jdbcDataSourceDao.findByIdWithNoCredentials(id);
        DataSource dataSource = jdbcDataSourceService.getDataSource(id);
        return jdbcQueryService.ping(dataSource, ds.getPing());
    }

    @RequestMapping(
            value = "/schema/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<Table> getSchema(@PathVariable("id") long id) {
        DataSource dataSource = jdbcDataSourceService.getDataSource(id);
        return jdbcQueryService.getSchema(dataSource);
    }
}
