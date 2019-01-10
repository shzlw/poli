package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Dashboard;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DashboardRowMapper implements RowMapper<Dashboard> {

    @Override
    public Dashboard mapRow(ResultSet rs, int i) throws SQLException {
        Dashboard d = new Dashboard();
        d.setId(rs.getLong(Dashboard.ID));
        d.setName(rs.getString(Dashboard.NAME));
        d.setWidth(rs.getInt(Dashboard.WIDTH));
        d.setHeight(rs.getInt(Dashboard.HEIGHT));
        return d;
    }
}
