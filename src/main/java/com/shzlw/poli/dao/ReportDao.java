package com.shzlw.poli.dao;

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
public class ReportDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<Report> findAll() {
        String sql = "SELECT id, name, style FROM p_report";
        return jt.query(sql, new Object[] {}, new ReportRowMapper());
    }

    public List<Report> findByViewer(long userId) {
        String sql = "SELECT d.id, d.name, d.style "
                    + "FROM p_group_report gd, p_report d, p_group_user gu "
                    + "WHERE gd.report_id = d.id "
                    + "AND gd.group_id = gu.group_id "
                    + "AND gu.user_id = ? "
                    + "GROUP BY d.id, d.name, d.style";
        return jt.query(sql, new Object[] { userId }, new ReportRowMapper());
    }

    public Report findById(long id) {
        String sql = "SELECT id, name, style FROM p_report WHERE id=?";
        try {
            return (Report) jt.queryForObject(sql, new Object[]{ id }, new ReportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Report findByName(String name) {
        String sql = "SELECT id, name, style FROM p_report WHERE name=?";
        try {
            return (Report) jt.queryForObject(sql, new Object[]{ name }, new ReportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
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

    public int update(Report r) {
        String sql = "UPDATE p_report SET name=?, style=? WHERE id=?";
        return jt.update(sql, new Object[] { r.getName(), r.getStyle(), r.getId() });
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_report WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    private static class ReportRowMapper implements RowMapper<Report> {

        @Override
        public Report mapRow(ResultSet rs, int i) throws SQLException {
            Report r = new Report();
            r.setId(rs.getLong(Report.ID));
            r.setName(rs.getString(Report.NAME));
            r.setStyle(rs.getString(Report.STYLE));
            return r;
        }
    }
}
