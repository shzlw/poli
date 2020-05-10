package com.shzlw.poli.dao;

import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.util.PasswordUtils;
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
import java.util.List;

@Repository
public class JdbcDataSourceDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<JdbcDataSource> findAllWithNoCredentials() {
        String sql = "SELECT id, name, connection_url, driver_class_name, username, ping FROM p_datasource";
        return jt.query(sql, new Object[] {}, new JdbcDataSourceInfoMapper());
    }

    public JdbcDataSource findByIdWithNoCredentials(long id) {
        String sql = "SELECT id, name, connection_url, driver_class_name, username, ping FROM p_datasource WHERE id=?";
        try {
            return (JdbcDataSource) jt.queryForObject(sql, new Object[]{ id }, new JdbcDataSourceInfoMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
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
        String encryptedPassword = PasswordUtils.getEncryptedPassword(rawPassword);
        String sql = "INSERT INTO p_datasource(name, connection_url, driver_class_name, username, password, ping) "
                    + "VALUES(:name, :connection_url, :driver_class_name, :username, :password, :ping)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(JdbcDataSource.NAME, ds.getName());
        params.addValue(JdbcDataSource.CONNECTION_URL, ds.getConnectionUrl());
        params.addValue(JdbcDataSource.DRIVER_CLASS_NAME, ds.getDriverClassName());
        params.addValue(JdbcDataSource.USERNAME, ds.getUsername());
        params.addValue(JdbcDataSource.PASSWORD, encryptedPassword);
        params.addValue(JdbcDataSource.PING, ds.getPing());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { JdbcDataSource.ID});
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
            String encryptedPassword = PasswordUtils.getEncryptedPassword(rawPassword);
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
            String rawPassword = PasswordUtils.getDecryptedPassword(encryptedPassword);
            ds.setPassword(rawPassword);
            ds.setPing(rs.getString(JdbcDataSource.PING));
            return ds;
        }
    }
}
