package com.shzlw.poleo.dao;

import com.shzlw.poleo.model.Component;
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
public class ComponentDao {

    @Autowired
    JdbcTemplate jt;

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
                    + "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, c.getReportId());
            ps.setLong(2, c.getJdbcDataSourceId());
            ps.setString(3, c.getTitle());
            ps.setString(4, c.getSqlQuery());
            ps.setInt(5, c.getWidth());
            ps.setInt(6, c.getHeight());
            ps.setInt(7, c.getX());
            ps.setInt(8, c.getY());
            ps.setString(9, c.getData());
            ps.setString(10, c.getDrillThrough());
            ps.setString(11, c.getStyle());
            ps.setString(12, c.getType());
            ps.setString(13, c.getSubType());
            return ps;
        }, keyHolder);

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
            c.setId(rs.getLong("id"));
            c.setReportId(rs.getLong("report_id"));
            c.setJdbcDataSourceId(rs.getLong("datasource_id"));
            c.setTitle(rs.getString("title"));
            c.setSqlQuery(rs.getString("sql_query"));
            c.setX(rs.getInt("x"));
            c.setY(rs.getInt("y"));
            c.setWidth(rs.getInt("width"));
            c.setHeight(rs.getInt("height"));
            c.setData(rs.getString("data"));
            c.setDrillThrough(rs.getString("drill_through"));
            c.setStyle(rs.getString("style"));
            c.setType(rs.getString("type"));
            c.setSubType(rs.getString("sub_type"));
            return c;
        }
    }
}
