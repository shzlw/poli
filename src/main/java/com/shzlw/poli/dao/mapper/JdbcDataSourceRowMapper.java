package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.JdbcDataSource;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class JdbcDataSourceRowMapper implements RowMapper<JdbcDataSource> {

    @Override
    public JdbcDataSource mapRow(ResultSet rs, int i) throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setId(rs.getLong(JdbcDataSource.ID));
        ds.setName(rs.getString(JdbcDataSource.NAME));
        ds.setConnectionUrl(rs.getString(JdbcDataSource.CONNECTION_URL));
        ds.setUsername(rs.getString(JdbcDataSource.USERNAME));
        ds.setType(rs.getString(JdbcDataSource.TYPE));
        ds.setPing(rs.getString(JdbcDataSource.PING));
        return ds;
    }
}
