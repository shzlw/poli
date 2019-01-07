package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Board;
import com.shzlw.poli.model.Filter;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FilterMapper implements RowMapper<Filter> {

    @Override
    public Filter mapRow(ResultSet rs, int i) throws SQLException {
        Filter f = new Filter();
        f.setId(rs.getLong("id"));
        f.setData(rs.getString("data"));
        return null;
    }
}
