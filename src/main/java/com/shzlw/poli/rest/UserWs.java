package com.shzlw.poli.rest;

import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.UserService;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ws/user")
public class UserWs {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserWs.class);

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<User> findAll(HttpServletRequest request) {
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        List<User> users = new ArrayList<>();
        if (Constants.SYS_ROLE_ADMIN.equals(myUser.getSysRole())) {
            users = userDao.findNonAdminUsers(myUser.getId());
        } else if (Constants.SYS_ROLE_DEVELOPER.equals(myUser.getSysRole())) {
            users = userDao.findViewerUsers(myUser.getId());
        }

        // FIXME: N + 1 query
        for (User user : users) {
            List<Long> userGroups = userDao.findUserGroups(user.getId());
            user.setUserGroups(userGroups);
        }
        return users;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public User one(@PathVariable("id") long userId) {
        User user = userDao.findById(userId);
        List<Long> userGroups = userDao.findUserGroups(userId);
        user.setUserGroups(userGroups);
        return user;
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody User user,
                                    HttpServletRequest request) {
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        if (!isDeveloperOperationValid(myUser.getSysRole(), user)) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        long userId = userDao.insertUser(user.getUsername(), user.getName(), user.getTempPassword(), user.getSysRole());
        userDao.insertUserGroups(userId, user.getUserGroups());
        return new ResponseEntity<Long>(userId, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody User user,
                                    HttpServletRequest request) {
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        if (!isDeveloperOperationValid(myUser.getSysRole(), user)) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        long userId = user.getId();
        User savedUser = userDao.findById(userId);
        userService.invalidateCache(savedUser.getSessionKey());

        userDao.updateUser(user);
        userDao.deleteUserGroups(userId);
        userDao.insertUserGroups(userId, user.getUserGroups());
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long userId,
                                    HttpServletRequest request) {
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        User savedUser = userDao.findById(userId);
        if (!isDeveloperOperationValid(myUser.getSysRole(), savedUser)) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        userService.invalidateCache(savedUser.getSessionKey());

        userDao.deleteUserGroups(userId);
        userDao.deleteUser(userId);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(
            value = "/account",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public User findAccountBySessionKey(HttpServletRequest request) {
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        User myAccount = userDao.findAccount(myUser.getId());
        return myAccount;
    }

    @RequestMapping(
            value = "/account",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public void updateUserBySessionKey(@RequestBody User user,
                                       @CookieValue(Constants.SESSION_KEY) String sessionKey,
                                       HttpServletRequest request) {
        userService.invalidateCache(sessionKey);
        User myUser = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        userDao.updateUserAccount(myUser.getId(), user.getName(), user.getPassword());
    }

    private boolean isDeveloperOperationValid(String mySysRole, User targetUser) {
        if (Constants.SYS_ROLE_DEVELOPER.equals(mySysRole)
                && !Constants.SYS_ROLE_VIEWER.equals(targetUser.getSysRole())) {
            return false;
        }
        return true;
    }
}