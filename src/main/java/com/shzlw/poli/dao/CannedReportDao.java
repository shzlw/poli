package com.shzlw.poli.dao;

import com.shzlw.poli.model.CannedReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(CannedReportDao.class);

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
                r.setId(rs.getLong(CannedReport.ID));
                r.setCreatedBy(rs.getString(CannedReport.CREATED_BY));
                r.setCreatedAt(rs.getLong(CannedReport.CREATED_AT));
                r.setName(rs.getString(CannedReport.NAME));
                r.setData(rs.getString(CannedReport.DATA));
                return r;
            });
            return cannedReport;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long insert(long userId, long createdAt, String name, String data) {
        String sql = "INSERT INTO p_canned_report(user_id, created_at, name, data) "
                    + "VALUES(:user_id, :created_at, :name, :data)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(CannedReport.USER_ID, userId);
        params.addValue(CannedReport.CREATED_AT, createdAt);
        params.addValue(CannedReport.NAME, name);
        params.addValue(CannedReport.DATA, data);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { CannedReport.ID });
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
            r.setId(rs.getLong(CannedReport.ID));
            r.setCreatedBy(rs.getString(CannedReport.CREATED_BY));
            r.setCreatedAt(rs.getLong(CannedReport.CREATED_AT));
            r.setName(rs.getString(CannedReport.NAME));
            return r;
        }
    }
}
