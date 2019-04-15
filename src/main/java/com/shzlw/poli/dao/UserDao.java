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
import org.springframework.util.StringUtils;

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

    public User findByUsernameAndPassword(String username, String rawPassword) {
        String encryptedPassword = PasswordUtil.getMd5Hash(rawPassword);
        String sql = "SELECT id, username, name, sys_role "
                    + "FROM p_user "
                    + "WHERE username=? AND password=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{username, encryptedPassword}, new UserInfoRowMapper());
            return user;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User findByUsernameAndTempPassword(String username, String rawTempPassword) {
        String encryptedPassword = PasswordUtil.getMd5Hash(rawTempPassword);
        String sql = "SELECT id, username, name, sys_role "
                    + "FROM p_user "
                    + "WHERE username=? AND temp_password=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{username, encryptedPassword}, new UserInfoRowMapper());
            return user;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User findBySessionKey(String sessionKey) {
        String sql = "SELECT id, username, name, sys_role "
                + "FROM p_user WHERE session_key=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{sessionKey}, new UserInfoRowMapper());
            return user;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User findById(long id) {
        String sql = "SELECT id, username, name, sys_role "
                + "FROM p_user WHERE id=?";
        try {
            User user = (User) jt.queryForObject(sql, new Object[]{id}, new UserInfoRowMapper());
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

    public int updateTempPassword(long userId, String rawNewPassword) {
        String encryptedPassword = PasswordUtil.getMd5Hash(rawNewPassword);
        String sql = "UPDATE p_user SET temp_password=NULL, password=? WHERE id=?";
        return jt.update(sql, new Object[] { encryptedPassword, userId });
    }

    public List<User> findNonAdminUsers(long myUserId) {
        String sql = "SELECT id, username, name, sys_role "
                    + "FROM p_user WHERE sys_role IN ('viewer', 'developer') AND id != ?";
        return jt.query(sql, new Object[]{myUserId}, new UserInfoRowMapper());
    }

    public List<User> findViewerUsers(long myUserId) {
        String sql = "SELECT id, username, name, sys_role "
                    + "FROM p_user WHERE sys_role = 'viewer' AND id != ?";
        return jt.query(sql, new Object[]{myUserId}, new UserInfoRowMapper());
    }

    public List<Long> findUserGroups(long userId) {
        String sql = "SELECT group_id FROM p_group_user WHERE user_id = ?";
        return jt.queryForList(sql, new Object[]{ userId }, Long.class);
    }

    public long insertUser(String username, String name, String rawTempPassword, String sysRole) {
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

    public void insertUserGroups(long userId, List<Long> userGroups) {
        String sql = "INSERT INTO p_group_user(group_id, user_id) VALUES(?, ?)";
        // TODO: batch
        for (Long groupId: userGroups) {
            jt.update(sql, new Object[]{ groupId, userId });
        }
    }

    public long updateUser(User user) {
        String rawTempPassword = user.getTempPassword();
        if (StringUtils.isEmpty(rawTempPassword)) {
            String sql = "UPDATE p_user SET username=?, name=?, sys_role=? WHERE id=?";
            return jt.update(sql, new Object[]{
                    user.getUsername(),
                    user.getName(),
                    user.getSysRole(),
                    user.getId()
            });
        } else {
            String encryptedPassword = PasswordUtil.getMd5Hash(rawTempPassword);
            String sql = "UPDATE p_user SET username=?, name=?, sys_role=?, password=NULL, temp_password=? "
                        + "WHERE id=?";
            return jt.update(sql, new Object[]{
                    user.getUsername(),
                    user.getName(),
                    user.getSysRole(),
                    encryptedPassword,
                    user.getId()
            });
        }
    }
    public long updateUserAccount(long userId, String name, String rawPassword) {
        if (StringUtils.isEmpty(rawPassword)) {
            String sql = "UPDATE p_user SET name=? WHERE id=?";
            return jt.update(sql, new Object[]{ name, userId });
        } else {
            String encryptedPassword = PasswordUtil.getMd5Hash(rawPassword);
            String sql = "UPDATE p_user SET name=?, password=? WHERE id=?";
            return jt.update(sql, new Object[]{ name, encryptedPassword, userId });
        }
    }



    public int deleteUser(long userId) {
        String sql = "DELETE FROM p_user WHERE id=?";
        return jt.update(sql, new Object[]{ userId });
    }

    public int deleteUserGroups(long userId) {
        String sql = "DELETE FROM p_group_user WHERE user_id=?";
        return jt.update(sql, new Object[]{ userId });
    }

    private static class UserInfoRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int i) throws SQLException {
            User r = new User();
            r.setId(rs.getLong(User.ID));
            r.setUsername(rs.getString(User.USERNAME));
            r.setName(rs.getString(User.NAME));
            r.setSysRole(rs.getString(User.SYS_ROLE));
            return r;
        }
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
