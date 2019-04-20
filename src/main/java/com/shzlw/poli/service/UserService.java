package com.shzlw.poli.service;

import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    /**
     * Key: session key
     * Value: sys role
     */
    // FIXME use a cache library to invalidate cache.
    private static final Map<String, User> SESSION_USER_CACHE = new ConcurrentHashMap<>();

    @Autowired
    UserDao userDao;

    public User getOrCacheUser(String sessionKey) {
        User user = SESSION_USER_CACHE.get(sessionKey);
        if (user == null) {
            user = userDao.findBySessionKey(sessionKey);
            if (user != null) {
                SESSION_USER_CACHE.put(sessionKey, user);
            }
        }
        return user;
    }

    public void newOrUpdateSessionUserCache(User user, String newSessionKey) {
        String oldSessionKey = null;
        for (Map.Entry<String, User> entry : SESSION_USER_CACHE.entrySet()) {
            User oldUser = entry.getValue();
            if (user.getId() == oldUser.getId()) {
                oldSessionKey = entry.getKey();
                break;
            }
        }
        if (oldSessionKey != null) {
            SESSION_USER_CACHE.remove(oldSessionKey);
        }
        SESSION_USER_CACHE.put(newSessionKey, user);
    }

    public void removeFromSessionCache(String sessionKey) {
        SESSION_USER_CACHE.remove(sessionKey);
    }
}
