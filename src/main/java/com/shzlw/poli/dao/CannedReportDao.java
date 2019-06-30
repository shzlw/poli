package com.shzlw.poli.dao;

import com.shzlw.poli.model.CannedReport;
import com.shzlw.poli.model.User;
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
public class CannedReportDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<CannedReport> findAll() {
        String sql = "SELECT r.id, r.created_at, u.username AS created_by, r.name "
                    + "FROM p_canned_report r "
                    + "LEFT JOIN p_user u ON r.user_id = u.id";
        return jt.query(sql, new Object[]{}, new CannedReportInfoMapper());
    }

    public List<CannedReport> findByUserId(long userId) {
        String sql = "SELECT r.id, r.created_at, u.username AS created_by, r.name "
                + "FROM p_canned_report r "
                + "LEFT JOIN p_user u ON r.user_id = u.id "
                + "WHERE r.user_id=?";
        return jt.query(sql, new Object[]{ userId }, new CannedReportInfoMapper());
    }

    public CannedReport findById(long id) {
        String sql = "SELECT r.id, r.created_at, u.username AS created_by, r.name, r.data "
                    + "FROM p_canned_report r "
                    + "LEFT JOIN p_user u ON r.user_id = u.id "
                    + "WHERE r.id=?";
        try {
            CannedReport cannedReport =  jt.queryForObject(sql, new Object[]{ id }, (rs, i) -> {
                CannedReport r = new CannedReport();
                r.setId(rs.getLong("id"));
                r.setCreatedBy(rs.getString("created_by"));
                r.setCreatedAt(rs.getLong("created_at"));
                r.setName(rs.getString("name"));
                r.setData(rs.getString("data"));
                return r;
            });
            return cannedReport;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long insert(long userId, long createdAt, String name, String data) {
        String sql = "INSERT INTO p_canned_report(user_id, created_at, name, data) "
                    + "VALUES(:userId, :createdAt, :name, :data)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        params.addValue("createdAt", createdAt);
        params.addValue("name", name);
        params.addValue("data", data);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { "id" });
        return keyHolder.getKey().longValue();
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_canned_report WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    public int deleteByUserId(long userId) {
        String sql = "DELETE FROM p_canned_report WHERE user_id=?";
        return jt.update(sql, new Object[]{ userId });
    }

    private static class CannedReportInfoMapper implements RowMapper<CannedReport> {
        @Override
        public CannedReport mapRow(ResultSet rs, int i) throws SQLException {
            CannedReport r = new CannedReport();
            r.setId(rs.getLong("id"));
            r.setCreatedBy(rs.getString("created_by"));
            r.setCreatedAt(rs.getLong("created_at"));
            r.setName(rs.getString("name"));
            return r;
        }
    }
}
