package com.shzlw.poli.rest;

import com.shzlw.poli.dao.SavedQueryDao;
import com.shzlw.poli.model.SavedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/saved-queries")
public class SavedQueryWs {

    @Autowired
    SavedQueryDao savedQueryDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<SavedQuery> findAll(@RequestParam(name = "search", defaultValue = "", required = false) String searchValue,
                                    @RequestParam(name = "page", defaultValue = "1", required = false) int page,
                                    @RequestParam(name = "size", defaultValue = "20", required = false) int pageSize) {
        return savedQueryDao.findAll(page, pageSize, searchValue);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public SavedQuery one(@PathVariable("id") long id) {
        return savedQueryDao.find(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody SavedQuery savedQuery) {
        String name = savedQuery.getName();
        long id = savedQueryDao.insert(name);
        return new ResponseEntity<>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody SavedQuery savedQuery) {
        savedQueryDao.update(savedQuery);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        savedQueryDao.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
