package com.shzlw.poli.dao;

import com.shzlw.poli.model.User;
import com.shzlw.poli.util.CommonUtil;
import com.shzlw.poli.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class UserDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public User fetchByUsernameAndPassword(String username, String rawPassword) {
        String encryptedPassword = PasswordUtil.getMd5Hash(rawPassword);
        String sql = "SELECT id, username, name, session_key, session_timeout, sys_role, api_key "
                    + "FROM p_user "
                    + "WHERE username=? AND password=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{username, encryptedPassword}, new UserRowMapper());
            return user;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User fetchBySessionKey(String sessionKey) {
        String sql = "SELECT id, username, name, session_key, session_timeout, sys_role, api_key "
                    + "FROM p_user WHERE sessionKey=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{sessionKey}, new UserRowMapper());
            return user;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updateSessionKey(long userId, String sessionKey) {
        long sessionTimeout = CommonUtil.toEpoch(LocalDateTime.now());
        String sql = "UPDATE p_user SET session_key=?, session_timeout=? WHERE id=?";
        return jt.update(sql, new Object[] { sessionKey, sessionTimeout, userId});
    }

    public List<User> fetchAll() {
        return null;
    }

    public long add(String username, String name, String rawTempPassword, String sysRole) {
        String encryptedPassword = PasswordUtil.getMd5Hash(rawTempPassword);
        String sql = "INSERT INTO p_user(username, name, temp_password, sys_role) "
                    + "VALUES(:username, :name, :temp_password, :sys_role)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(User.USERNAME, username);
        params.addValue(User.NAME, name);
        params.addValue(User.TEMP_PASSWORD, encryptedPassword);
        params.addValue(User.SYS_ROLE, sysRole);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { User.ID});
        return keyHolder.getKey().longValue();
    }

    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int i) throws SQLException {
            User r = new User();
            r.setId(rs.getLong(User.ID));
            r.setUsername(rs.getString(User.USERNAME));
            r.setName(rs.getString(User.NAME));
            r.setSessionKey(rs.getString(User.SESSION_KEY));
            r.setSessionTimeout(CommonUtil.fromEpoch(rs.getLong(User.SESSION_TIMEOUT)));
            r.setSysRole(rs.getString(User.SYS_ROLE));
            r.setApiKey(rs.getString(User.API_KEY));
            return r;
        }
    }
}
