package com.shzlw.poli.rest;

import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/ws/components")
public class ComponentWs {

    @Autowired
    ComponentDao componentDao;

    @Autowired
    ReportService reportService;

    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Component one(@PathVariable("id") long id) {
        return componentDao.findById(id);
    }

    @RequestMapping(value = "/report/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public ResponseEntity<?> findByReportId(@PathVariable("id") long reportId,
                                            HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        List<Report> reports = reportService.getReportsByUser(user);
        if (reports.isEmpty()) {
            // No report found.
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
        }
        boolean isFound = reports.stream().anyMatch(d -> d.getId() == reportId);
        if (isFound) {
            List<Component> components = componentDao.findByReportId(reportId);
            return new ResponseEntity<>(components, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Component component) {
        long id = componentDao.insert(component);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        componentDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/data", method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Component component) {
        componentDao.updateData(component);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/position", method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> updatePosition(@RequestBody Component component) {
        componentDao.updatePosition(component);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/style", method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> updatePositionAndStyle(@RequestBody Component component) {
        componentDao.updatePositionAndStyle(component);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
