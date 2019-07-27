package com.shzlw.poli.dao;

import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ComponentDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<Component> findByReportId(long reportId) {
        String sql = "SELECT id, datasource_id, report_id, title, sql_query, width, height, x, y, data, drill_through, style, type, sub_type "
                    + "FROM p_component WHERE report_id=?";
        return jt.query(sql, new Object[] { reportId }, new ComponentRowMapper());
    }

    public Component findById(long id) {
        String sql = "SELECT id, datasource_id, report_id, title, sql_query, width, height, x, y, data, drill_through, style, type, sub_type "
                    + "FROM p_component WHERE id=?";
        try {
            return (Component) jt.queryForObject(sql, new Object[]{ id }, new ComponentRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updatePosition(Component c) {
        String sql = "UPDATE p_component SET width=?, height=?, x=?, y=? WHERE id=?";
        return jt.update(sql, new Object[] { c.getWidth(), c.getHeight(), c.getX(), c.getY(), c.getId() });
    }

    public int updatePositionAndStyle(Component c) {
        String sql = "UPDATE p_component SET width=?, height=?, x=?, y=?, style=?, title=? WHERE id=?";
        return jt.update(sql, new Object[] { c.getWidth(), c.getHeight(), c.getX(), c.getY(), c.getStyle(), c.getTitle(), c.getId() });
    }

    public int updateData(Component c) {
        String sql = "UPDATE p_component "
                    + "SET datasource_id=?, title=?, sql_query=?, data=?, drill_through=?, type=?, sub_type=? "
                    + "WHERE id=?";
        return jt.update(sql, new Object[] {
                c.getJdbcDataSourceId(),
                c.getTitle(),
                c.getSqlQuery(),
                c.getData(),
                c.getDrillThrough(),
                c.getType(),
                c.getSubType(),
                c.getId()
        });
    }

    public int updateByDataSourceId(long dataSourceId) {
        String sql = "UPDATE p_component SET dataSource_id = NULL WHERE dataSource_id = ?";
        return jt.update(sql, new Object[]{ dataSourceId });
    }

    public long insert(Component c) {
        String sql = "INSERT INTO p_component(report_id, datasource_id, title, sql_query, width, height, x, y, data, drill_through, style, type, sub_type) "
                    + "VALUES(:report_id, :datasource_id, :title, :sql_query, :width, :height, :x, :y, :data, :drill_through, :style, :type, :sub_type)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(Component.REPORT_ID, c.getReportId());
        params.addValue(Component.DATASOURCE_ID, c.getJdbcDataSourceId());
        params.addValue(Component.TITLE, c.getTitle());
        params.addValue(Component.SQL_QUERY, c.getSqlQuery());
        params.addValue(Component.WIDTH, c.getWidth());
        params.addValue(Component.HEIGHT, c.getHeight());
        params.addValue(Component.X, c.getX());
        params.addValue(Component.Y, c.getY());
        params.addValue(Component.DATA, c.getData());
        params.addValue(Component.DRILL_THROUGH, c.getDrillThrough());
        params.addValue(Component.STYLE, c.getStyle());
        params.addValue(Component.TYPE, c.getType());
        params.addValue(Component.SUB_TYPE, c.getSubType());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { Report.ID});
        return keyHolder.getKey().longValue();
    }

    public long insert(String name, String style) {
        String sql = "INSERT INTO p_report(name, style) VALUES(:name, :style)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(Report.NAME, name);
        params.addValue(Report.STYLE, style);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { Report.ID});
        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_component WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    public int deleteByReportId(long reportId) {
        String sql = "DELETE FROM p_component WHERE report_id=?";
        return jt.update(sql, new Object[]{ reportId });
    }

    public int deleteByDataSourceId(long dataSourceId) {
        String sql = "DELETE FROM p_component WHERE datasource_id=?";
        return jt.update(sql, new Object[]{ dataSourceId });
    }

    private static class ComponentRowMapper implements RowMapper<Component> {

        @Override
        public Component mapRow(ResultSet rs, int i) throws SQLException {
            Component c = new Component();
            c.setId(rs.getLong(Component.ID));
            c.setReportId(rs.getLong(Component.REPORT_ID));
            c.setJdbcDataSourceId(rs.getLong(Component.DATASOURCE_ID));
            c.setTitle(rs.getString(Component.TITLE));
            c.setSqlQuery(rs.getString(Component.SQL_QUERY));
            c.setX(rs.getInt(Component.X));
            c.setY(rs.getInt(Component.Y));
            c.setWidth(rs.getInt(Component.WIDTH));
            c.setHeight(rs.getInt(Component.HEIGHT));
            c.setData(rs.getString(Component.DATA));
            c.setDrillThrough(rs.getString(Component.DRILL_THROUGH));
            c.setStyle(rs.getString(Component.STYLE));
            c.setType(rs.getString(Component.TYPE));
            c.setSubType(rs.getString(Component.SUB_TYPE));
            return c;
        }
    }
}
