package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Filter;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FilterRowMapper implements RowMapper<Filter> {

    @Override
    public Filter mapRow(ResultSet rs, int i) throws SQLException {
        Filter f = new Filter();
        f.setId(rs.getLong("id"));
        f.setData(rs.getString("data"));
        f.setName(rs.getString("name"));
        f.setType(rs.getString("type"));
        f.setDashboardId(rs.getLong("dashboard_id"));
        return f;
    }
}
