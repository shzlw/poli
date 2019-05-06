package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    /**
     * Key: Session key
     * Value: User
     */
    private static Cache<String, User> SESSION_USER_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build();

    @Autowired
    UserDao userDao;

    public User getUser(String sessionKey) {
        if (StringUtils.isEmpty(sessionKey)) {
            return null;
        }

        try {
            User user = SESSION_USER_CACHE.get(sessionKey, () -> userDao.findBySessionKey(sessionKey));
            return user;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return null;
        }
    }

    public void newOrUpdateUser(User user, String oldSessionKey, String newSessionKey) {
        invalidateCache(oldSessionKey);
        SESSION_USER_CACHE.put(newSessionKey, user);
    }

    public void invalidateCache(String sessionKey) {
        if (sessionKey != null) {
            SESSION_USER_CACHE.invalidate(sessionKey);
        }
    }
}
