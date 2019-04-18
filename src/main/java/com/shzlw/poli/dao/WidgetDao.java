package com.shzlw.poli.dao;

import com.shzlw.poli.model.Widget;
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
public class WidgetDao {

    @Autowired
    JdbcTemplate jt;

    public List<Widget> findByDashboardId(long dashboardId) {
        String sql = "SELECT id, datasource_id, dashboard_id, title, sql_query, width, height, x, y, chart_type, data, drill_through, style, type, filter_type "
                    + "FROM p_widget WHERE dashboard_id=?";
        return jt.query(sql, new Object[] { dashboardId }, new WidgetRowMapper());
    }

    public Widget findById(long id) {
        String sql = "SELECT id, datasource_id, dashboard_id, title, sql_query, width, height, x, y, chart_type, data, drill_through, style, type, filter_type "
                    + "FROM p_widget WHERE id=?";
        try {
            return (Widget) jt.queryForObject(sql, new Object[]{ id }, new WidgetRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updatePosition(Widget w) {
        String sql = "UPDATE p_widget SET width=?, height=?, x=?, y=? WHERE id=?";
        return jt.update(sql, new Object[] { w.getWidth(), w.getHeight(), w.getX(), w.getY(), w.getId() });
    }

    public int update(Widget w) {
        String sql = "UPDATE p_widget SET datasource_id=?, title=?, sql_query=?, chart_type=?, data=?, drill_through=?, style=?, type=?, filter_type=? "
                    + "WHERE id=?";
        return jt.update(sql, new Object[] {
                w.getJdbcDataSourceId(),
                w.getTitle(),
                w.getSqlQuery(),
                w.getChartType(),
                w.getData(),
                w.getDrillThrough(),
                w.getStyle(),
                w.getType(),
                w.getFilterType(),
                w.getId()
        });
    }

    public int updateByDataSourceId(long dataSourceId) {
        String sql = "UPDATE p_widget SET dataSource_id = NULL WHERE dataSource_id = ?";
        return jt.update(sql, new Object[]{ dataSourceId });
    }

    public long insert(Widget w) {
        String sql = "INSERT INTO p_widget(dashboard_id, datasource_id, title, sql_query, width, height, x, y, chart_type, data, drill_through, style, type, filter_type) "
                    + "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, w.getDashboardId());
            ps.setLong(2, w.getJdbcDataSourceId());
            ps.setString(3, w.getTitle());
            ps.setString(4, w.getSqlQuery());
            ps.setInt(5, w.getWidth());
            ps.setInt(6, w.getHeight());
            ps.setInt(7, w.getX());
            ps.setInt(8, w.getY());
            ps.setString(9, w.getChartType());
            ps.setString(10, w.getData());
            ps.setString(11, w.getDrillThrough());
            ps.setString(12, w.getStyle());
            ps.setString(13, w.getType());
            ps.setString(14, w.getFilterType());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_widget WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    public int deleteByDashboardId(long dashboardId) {
        String sql = "DELETE FROM p_widget WHERE dashboard_id=?";
        return jt.update(sql, new Object[]{ dashboardId });
    }

    public int deleteByDataSourceId(long dataSourceId) {
        String sql = "DELETE FROM p_widget WHERE datasource_id=?";
        return jt.update(sql, new Object[]{ dataSourceId });
    }

    private static class WidgetRowMapper implements RowMapper<Widget> {

        @Override
        public Widget mapRow(ResultSet rs, int i) throws SQLException {
            Widget w = new Widget();
            w.setId(rs.getLong("id"));
            w.setDashboardId(rs.getLong("dashboard_id"));
            w.setJdbcDataSourceId(rs.getLong("datasource_id"));
            w.setTitle(rs.getString("title"));
            w.setSqlQuery(rs.getString("sql_query"));
            w.setX(rs.getInt("x"));
            w.setY(rs.getInt("y"));
            w.setWidth(rs.getInt("width"));
            w.setHeight(rs.getInt("height"));
            w.setChartType(rs.getString("chart_type"));
            w.setData(rs.getString("data"));
            w.setDrillThrough(rs.getString("drill_through"));
            w.setStyle(rs.getString("style"));
            w.setType(rs.getString("type"));
            w.setFilterType(rs.getString("filter_type"));
            return w;
        }
    }
}
