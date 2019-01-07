package com.shzlw.poli.dao;

import com.shzlw.poli.dao.mapper.BoardMapper;
import com.shzlw.poli.dao.mapper.JdbcDataSourceMapper;
import com.shzlw.poli.model.Board;
import com.shzlw.poli.model.JdbcDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class BoardDao {

    @Autowired
    JdbcTemplate jt;

    public List<Board> fetchAll() {
        String sql = "SELECT id, name, width, height FROM p_board";
        List<Board> boards = jt.query(sql, new Object[] { }, new BoardMapper());
        return boards;
    }

    public Board fetchById(long id) {
        String sql = "SELECT id, name, width, height FROM p_board WHERE id=?";
        try {
            Board d = (Board) jt.queryForObject(sql, new Object[]{ id }, new BoardMapper());
            return d;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Board b) {
        String sql = "INSERT INTO p_board(name, width, height) VALUES(?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, b.getName());
            ps.setInt(2, b.getWidth());
            ps.setInt(3, b.getHeight());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_board WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }
}
