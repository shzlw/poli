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
        w.setData(rs.getString("data"));
        return w;
    }
}
