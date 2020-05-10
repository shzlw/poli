package com.shzlw.poli.rest;

import com.shzlw.poli.dao.SavedQueryDao;
import com.shzlw.poli.model.SavedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/saved-queries")
public class SavedQueryWs {

    @Autowired
    SavedQueryDao savedQueryDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<SavedQuery> findAll() {
        return savedQueryDao.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public SavedQuery one(@PathVariable("id") long id) {
        return savedQueryDao.find(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody SavedQuery savedQuery) {
        if (StringUtils.isEmpty(savedQuery.getEndpointName())) {
            savedQuery.setEndpointName(null);
        }
        long id = savedQueryDao.insert(savedQuery);
        return new ResponseEntity<>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody SavedQuery savedQuery) {
        if (StringUtils.isEmpty(savedQuery.getEndpointName())) {
            savedQuery.setEndpointName(null);
        }
        savedQueryDao.update(savedQuery);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        savedQueryDao.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public List<SavedQuery> findAllByPage(@RequestParam(name = "search", defaultValue = "", required = false) String searchValue,
                                          @RequestParam(name = "page", defaultValue = "1", required = false) int page,
                                          @RequestParam(name = "size", defaultValue = "20", required = false) int pageSize) {
        return savedQueryDao.findAllByPage(page, pageSize, searchValue);
    }
}
