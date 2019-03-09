package com.shzlw.poli.dao;

import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.Filter;
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
public class FilterDao {

    @Autowired
    JdbcTemplate jt;

    public List<Filter> fetchAllByDashboardId(long dashboardId) {
        String sql = "SELECT id, name, type, dashboard_id, data "
                    + "FROM p_filter WHERE dashboard_id=?";
        return jt.query(sql, new Object[] { dashboardId }, new FilterRowMapper());
    }

    public Filter fetchById(long id) {
        String sql = "SELECT id, name, type, dashboard_id, data "
                    + "FROM p_filter WHERE id=?";
        try {
            return jt.queryForObject(sql, new Object[]{ id }, new FilterRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Filter f) {
        String sql = "INSERT INTO p_filter(dashboard_id, name, type, data) "
                    + "VALUES(?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, f.getDashboardId());
            ps.setString(2, f.getName());
            ps.setString(3, f.getType());
            ps.setString(4, f.getData());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int update(Filter f) {
        String sql = "UPDATE p_filter SET name=?, type=?, data=? WHERE id=?";
        return jt.update(sql, new Object[] {
                f.getName(),
                f.getType(),
                f.getData(),
                f.getId()
        });
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_filter WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    public int deleteByDashboardId(long dashboardId) {
        String sql = "DELETE FROM p_filter WHERE dashboard_id=?";
        return jt.update(sql, new Object[]{ dashboardId });
    }

    private static class FilterRowMapper implements RowMapper<Filter> {

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
}
