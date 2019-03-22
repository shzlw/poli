package com.shzlw.poli.dao;

import com.shzlw.poli.model.Dashboard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Repository
public class DashboardDao {

    @Autowired
    JdbcTemplate jt;

    public List<Dashboard> fetchAll() {
        String sql = "SELECT id, name, height FROM p_dashboard";
        return jt.query(sql, new Object[] {}, new DashboardRowMapper());
    }

    public Dashboard fetchById(long id) {
        String sql = "SELECT id, name, height FROM p_dashboard WHERE id=?";
        try {
            return (Dashboard) jt.queryForObject(sql, new Object[]{ id }, new DashboardRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Dashboard fetchByName(String name) {
        String sql = "SELECT id, name, height FROM p_dashboard WHERE name=?";
        try {
            return (Dashboard) jt.queryForObject(sql, new Object[]{ name }, new DashboardRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Dashboard d) {
        String sql = "INSERT INTO p_dashboard(name, height) VALUES(?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, d.getName());
            ps.setInt(2, d.getHeight());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int update(Dashboard d) {
        String sql = "UPDATE p_dashboard SET name=?, height=? WHERE id=?";
        return jt.update(sql, new Object[] { d.getName(), d.getHeight(), d.getId() });
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_dashboard WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    private static class DashboardRowMapper implements RowMapper<Dashboard> {

        @Override
        public Dashboard mapRow(ResultSet rs, int i) throws SQLException {
            Dashboard d = new Dashboard();
            d.setId(rs.getLong(Dashboard.ID));
            d.setName(rs.getString(Dashboard.NAME));
            d.setHeight(rs.getInt(Dashboard.HEIGHT));
            return d;
        }
    }
}
