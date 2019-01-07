package com.shzlw.poli.dao.mapper;

import com.shzlw.poli.model.Board;
import com.shzlw.poli.model.JdbcDataSource;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.Nullable;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BoardMapper implements RowMapper<Board> {

    @Override
    public Board mapRow(ResultSet rs, int i) throws SQLException {
        Board b = new Board();
        b.setId(rs.getLong(Board.ID));
        b.setName(rs.getString(Board.NAME));
        b.setWidth(rs.getInt(Board.WIDTH));
        b.setHeight(rs.getInt(Board.HEIGHT));
        return null;
    }
}
