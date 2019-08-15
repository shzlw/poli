package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    /**
     * Key: Session key
     * Value: User
     */
    private static final Cache<String, User> SESSION_USER_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    /**
     * Key: Api key
     * Value: User
     */
    private static final Cache<String, User> API_KEY_USER_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    @Autowired
    UserDao userDao;

    public User getUserBySessionKey(String sessionKey) {
        if (StringUtils.isEmpty(sessionKey)) {
            return null;
        }

        try {
            User user = SESSION_USER_CACHE.get(sessionKey, () -> {
                User u = userDao.findBySessionKey(sessionKey);
                u.setUserAttributes(userDao.findUserAttributes(u.getId()));
                return u;
            });
            return user;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return null;
        }
    }

    public User getUserByApiKey(String apiKey) {
        if (StringUtils.isEmpty(apiKey)) {
            return null;
        }

        try {
            User user = API_KEY_USER_CACHE.get(apiKey, () -> {
                User u = userDao.findByApiKey(apiKey);
                u.setUserAttributes(userDao.findUserAttributes(u.getId()));
                return u;
            });
            return user;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return null;
        }
    }

    public void newOrUpdateUser(User user, String oldSessionKey, String newSessionKey) {
        invalidateSessionUserCache(oldSessionKey);
        SESSION_USER_CACHE.put(newSessionKey, user);
    }

    public void invalidateSessionUserCache(String sessionKey) {
        if (sessionKey != null) {
            SESSION_USER_CACHE.invalidate(sessionKey);
        }
    }

    public void invalidateApiKeyUserCache(String apiKey) {
        if (apiKey != null) {
            API_KEY_USER_CACHE.invalidate(apiKey);
        }
    }
}
