package com.shzlw.poli.rest;

import com.shzlw.poli.dao.GroupDao;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.Group;
import com.shzlw.poli.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/group")
public class GroupWs {

    @Autowired
    GroupDao groupDao;

    @Autowired
    ReportService reportService;

    @Autowired
    UserDao userDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<Group> findAll() {
        // return groupDao.findAllWithReports();
        return groupDao.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Group findOne(@PathVariable("id") long groupId) {
        Group group = groupDao.findById(groupId);
        if (group == null) {
            return null;
        }
        List<Long> groupReports = groupDao.findGroupReports(groupId);
        group.setGroupReports(groupReports);
        return group;
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Group group) {
        long groupId = groupDao.insertGroup(group.getName());
        groupDao.insertGroupReports(groupId, group.getGroupReports());

        List<Long> userIds = userDao.findGroupUsers(groupId);
        for (Long userId : userIds) {
            reportService.invalidateCache(userId);
        }
        return new ResponseEntity<Long>(groupId, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Group group) {
        long groupId = group.getId();
        groupDao.updateGroup(group);
        groupDao.deleteGroupReports(groupId);
        groupDao.insertGroupReports(groupId, group.getGroupReports());

        List<Long> userIds = userDao.findGroupUsers(groupId);
        for (Long userId : userIds) {
            reportService.invalidateCache(userId);
        }
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long groupId) {
        groupDao.deleteGroupUsers(groupId);
        groupDao.deleteGroupReports(groupId);
        groupDao.deleteGroup(groupId);

        List<Long> userIds = userDao.findGroupUsers(groupId);
        for (Long userId : userIds) {
            reportService.invalidateCache(userId);
        }
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}