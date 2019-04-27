package com.shzlw.poli.dao;

import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Repository
public class JdbcDataSourceDao {

    @Autowired
    JdbcTemplate jt;

    public List<JdbcDataSource> findAllWithNoCredentials() {
        String sql = "SELECT id, name, connection_url, driver_class_name, username, ping FROM p_datasource";
        return jt.query(sql, new Object[] {}, new JdbcDataSourceInfoMapper());
    }

    public List<JdbcDataSource> findAll() {
        String sql = "SELECT id, name, connection_url, driver_class_name, username, password, ping FROM p_datasource";
        return jt.query(sql, new Object[] {}, new JdbcDataSourceRowMapper());
    }

    public JdbcDataSource findById(long id) {
        String sql = "SELECT id, name, connection_url, driver_class_name, username, password, ping FROM p_datasource WHERE id=?";
        try {
            return (JdbcDataSource) jt.queryForObject(sql, new Object[]{ id }, new JdbcDataSourceRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long insert(JdbcDataSource ds) {
        String rawPassword = ds.getPassword();
        String encryptedPassword = PasswordUtil.getEncryptedPassword(rawPassword);
        String sql = "INSERT INTO p_datasource(name, connection_url, driver_class_name, username, password, ping) VALUES(?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, ds.getName());
            ps.setString(2, ds.getConnectionUrl());
            ps.setString(3, ds.getDriverClassName());
            ps.setString(4, ds.getUsername());
            ps.setString(5, encryptedPassword);
            ps.setString(6, ds.getPing());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int update(JdbcDataSource ds) {
        String rawPassword = ds.getPassword();
        if (StringUtils.isEmpty(rawPassword)) {
            String sql = "UPDATE p_datasource SET name=?, connection_url=?, driver_class_name=?, username=?, ping=? WHERE id=?";
            return jt.update(sql, new Object[]{
                    ds.getName(),
                    ds.getConnectionUrl(),
                    ds.getDriverClassName(),
                    ds.getUsername(),
                    ds.getPing(),
                    ds.getId()
            });
        } else {
            String encryptedPassword = PasswordUtil.getEncryptedPassword(rawPassword);
            String sql = "UPDATE p_datasource SET name=?, connection_url=?, driver_class_name=?, username=?, password=?, ping=? WHERE id=?";
            return jt.update(sql, new Object[]{
                    ds.getName(),
                    ds.getConnectionUrl(),
                    ds.getDriverClassName(),
                    ds.getUsername(),
                    encryptedPassword,
                    ds.getPing(),
                    ds.getId()
            });
        }
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_datasource WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    private static class JdbcDataSourceInfoMapper implements RowMapper<JdbcDataSource> {
        @Override
        public JdbcDataSource mapRow(ResultSet rs, int i) throws SQLException {
            JdbcDataSource ds = new JdbcDataSource();
            ds.setId(rs.getLong(JdbcDataSource.ID));
            ds.setName(rs.getString(JdbcDataSource.NAME));
            ds.setConnectionUrl(rs.getString(JdbcDataSource.CONNECTION_URL));
            ds.setDriverClassName(rs.getString(JdbcDataSource.DRIVER_CLASS_NAME));
            ds.setUsername(rs.getString(JdbcDataSource.USERNAME));
            ds.setPing(rs.getString(JdbcDataSource.PING));
            return ds;
        }
    }

    private static class JdbcDataSourceRowMapper implements RowMapper<JdbcDataSource> {
        @Override
        public JdbcDataSource mapRow(ResultSet rs, int i) throws SQLException {
            JdbcDataSource ds = new JdbcDataSource();
            ds.setId(rs.getLong(JdbcDataSource.ID));
            ds.setName(rs.getString(JdbcDataSource.NAME));
            ds.setConnectionUrl(rs.getString(JdbcDataSource.CONNECTION_URL));
            ds.setDriverClassName(rs.getString(JdbcDataSource.DRIVER_CLASS_NAME));
            ds.setUsername(rs.getString(JdbcDataSource.USERNAME));
            String encryptedPassword = rs.getString(JdbcDataSource.PASSWORD);
            String rawPassword = PasswordUtil.getDecryptedPassword(encryptedPassword);
            ds.setPassword(rawPassword);
            ds.setPing(rs.getString(JdbcDataSource.PING));
            return ds;
        }
    }
}
