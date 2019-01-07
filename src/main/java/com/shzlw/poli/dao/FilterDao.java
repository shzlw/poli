package com.shzlw.poli.dao;

import com.shzlw.poli.dao.mapper.BoardMapper;
import com.shzlw.poli.dao.mapper.FilterMapper;
import com.shzlw.poli.model.Board;
import com.shzlw.poli.model.Filter;
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
public class FilterDao {

    @Autowired
    JdbcTemplate jt;

    public List<Filter> fetchAllByBoardId(long boardId) {
        String sql = "SELECT id, data FROM p_filter WHERE board_id=?";
        List<Filter> filters = jt.query(sql, new Object[] { boardId }, new FilterMapper());
        return filters;
    }

    public Filter fetchById(long id) {
        String sql = "SELECT id, data FROM p_filter WHERE id=?";
        try {
            Filter d = (Filter) jt.queryForObject(sql, new Object[]{ id }, new FilterMapper());
            return d;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Filter f) {
        String sql = "INSERT INTO p_filter(data) VALUES(?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, f.getData());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_filter WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }
}
