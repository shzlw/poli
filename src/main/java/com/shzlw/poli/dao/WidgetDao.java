package com.shzlw.poli.dao;

import com.shzlw.poli.dao.mapper.WidgetRowMapper;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.model.Widget;
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
public class WidgetDao {

    @Autowired
    JdbcTemplate jt;

    public List<Widget> fetchAllByDashboardId(long dashboardId) {
        String sql = "SELECT id, datasource_id, dashboard_id, name, sql_query, width, height, x, y, type "
                    + "FROM p_widget WHERE dashboard_id=?";
        return jt.query(sql, new Object[] { dashboardId }, new WidgetRowMapper());
    }

    public Widget fetchById(long id) {
        String sql = "SELECT id, datasource_id, dashboard_id, name, sql_query, width, height, x, y, type "
                    + "FROM p_widget WHERE id=?";
        try {
            return (Widget) jt.queryForObject(sql, new Object[]{ id }, new WidgetRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long add(Widget w) {
        String sql = "INSERT INTO p_widget(dashboard_id, datasource_id, name, sql_query, width, height, x, y, type) "
                    + "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, w.getDashboardId());
            ps.setLong(2, w.getJdbcDataSourceId());
            ps.setString(3, w.getName());
            ps.setString(4, w.getSqlQuery());
            ps.setInt(5, w.getWidth());
            ps.setInt(6, w.getHeight());
            ps.setInt(7, w.getX());
            ps.setInt(8, w.getY());
            ps.setString(9, w.getType());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_widget WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }
}
