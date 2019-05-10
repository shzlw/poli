package com.shzlw.poli.rest;

import com.shzlw.poli.dao.GroupDao;
import com.shzlw.poli.model.Group;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(GroupWs.class);

    @Autowired
    GroupDao groupDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<Group> all() {
        // FIXME: n + 1 query;
        List<Group> groups = groupDao.findAll();
        for (Group group : groups) {
            List<Long> groupDashboards = groupDao.findGroupDashboards(group.getId());
            group.setGroupDashboards(groupDashboards);
        }
        return groups;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Group one(@PathVariable("id") long groupId) {
        Group group = groupDao.findById(groupId);
        List<Long> groupDashboards = groupDao.findGroupDashboards(groupId);
        group.setGroupDashboards(groupDashboards);
        return group;
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Group group) {
        long groupId = groupDao.insertGroup(group.getName());
        groupDao.insertGroupDashboards(groupId, group.getGroupDashboards());
        return new ResponseEntity<Long>(groupId, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Group group) {
        long groupId = group.getId();
        groupDao.updateGroup(group);
        groupDao.deleteGroupDashboards(groupId);
        groupDao.insertGroupDashboards(groupId, group.getGroupDashboards());
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long groupId) {
        groupDao.deleteGroupUsers(groupId);
        groupDao.deleteGroupDashboards(groupId);
        groupDao.deleteGroup(groupId);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}