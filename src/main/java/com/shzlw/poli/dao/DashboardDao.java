package com.shzlw.poli.dao;

import com.shzlw.poli.dao.mapper.DashboardRowMapper;
import com.shzlw.poli.model.Dashboard;
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
public class DashboardDao {

    @Autowired
    JdbcTemplate jt;

    public List<Dashboard> fetchAll() {
        String sql = "SELECT id, name, width, height FROM p_dashboard";
        List<Dashboard> dashboards = jt.query(sql, new Object[] { }, new DashboardRowMapper());
        return dashboards;
    }

    public Dashboard fetchById(long id) {
        String sql = "SELECT id, name, width, height FROM p_dashboard WHERE id=?";
        try {
            Dashboard d = (Dashboard) jt.queryForObject(sql, new Object[]{ id }, new DashboardRowMapper());
            return d;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Dashboard d) {
        String sql = "INSERT INTO p_board(name, width, height) VALUES(?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, d.getName());
            ps.setInt(2, d.getWidth());
            ps.setInt(3, d.getHeight());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_dashboard WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }
}
