package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Dashboard;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DashboardRowMapper implements RowMapper<Dashboard> {

    @Override
    public Dashboard mapRow(ResultSet rs, int i) throws SQLException {
        Dashboard b = new Dashboard();
        b.setId(rs.getLong(Dashboard.ID));
        b.setName(rs.getString(Dashboard.NAME));
        b.setWidth(rs.getInt(Dashboard.WIDTH));
        b.setHeight(rs.getInt(Dashboard.HEIGHT));
        return null;
    }
}
