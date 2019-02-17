package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Filter;
import com.shzlw.poli.model.Widget;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class WidgetRowMapper implements RowMapper<Widget> {

    @Override
    public Widget mapRow(ResultSet rs, int i) throws SQLException {
        Widget w = new Widget();
        w.setId(rs.getLong("id"));
        w.setDashboardId(rs.getLong("dashboard_id"));
        w.setJdbcDataSourceId(rs.getLong("datasource_id"));
        w.setName(rs.getString("name"));
        w.setSqlQuery(rs.getString("sql_query"));
        w.setX(rs.getInt("x"));
        w.setY(rs.getInt("y"));
        w.setWidth(rs.getInt("width"));
        w.setHeight(rs.getInt("height"));
        w.setType(rs.getString("type"));
        return w;
    }
}
