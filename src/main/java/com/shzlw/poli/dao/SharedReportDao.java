package com.shzlw.poli.dao;

import com.shzlw.poli.dto.SharedReportRow;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.util.CommonUtils;
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
public class SharedReportDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<SharedReportRow> findAll() {
        String sql = "SELECT sr.id, share_key, r.name AS report_name, sr.report_type, u.username AS created_by, sr.created_at, sr.expired_by "
                    + "FROM p_shared_report sr "
                    + "LEFT JOIN p_user u ON sr.user_id = u.id "
                    + "LEFT JOIN p_report r ON sr.report_id = r.id "
                    + "ORDER BY sr.created_at DESC";
        return jt.query(sql, new Object[] {}, new SharedReportRowMapper());
    }

    public List<SharedReport> findByReportId(long reportId) {
        String sql = "SELECT share_key, expired_by FROM p_shared_report WHERE report_id=?";
        return jt.query(sql, new Object[] { reportId }, (rs, i) -> {
            SharedReport r = new SharedReport();
            r.setShareKey(rs.getString(SharedReport.SHARE_KEY));
            r.setExpiredBy(rs.getLong(SharedReport.EXPIRED_BY));
            return r;
        });
    }

    public long insert(String shareKey, long reportId, String reportType, long userId, long createdAt, long expiredBy) {
        String sql = "INSERT INTO p_shared_report(share_key, report_id, report_type, user_id, created_at, expired_by) "
                    + "VALUES(:share_key, :report_id, :report_type, :user_id, :created_at, :expired_by)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(SharedReport.SHARE_KEY, shareKey);
        params.addValue(SharedReport.REPORT_ID, reportId);
        params.addValue(SharedReport.REPORT_TYPE, reportType);
        params.addValue(SharedReport.USER_ID, userId);
        params.addValue(SharedReport.CREATED_AT, createdAt);
        params.addValue(SharedReport.EXPIRED_BY, expiredBy);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { SharedReport.ID });
        return keyHolder.getKey().longValue();
    }

    public SharedReport findById(long id) {
        String sql = "SELECT id, share_key, report_id, report_type, user_id, created_at, expired_by "
                    + "FROM p_shared_report WHERE id=?";
        try {
            return (SharedReport) jt.queryForObject(sql, new Object[]{ id }, new SharedReportRawMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public SharedReport findByShareKey(String shareKey) {
        String sql = "SELECT id, share_key, report_id, report_type, user_id, created_at, expired_by "
                    + "FROM p_shared_report WHERE share_key=?";
        try {
            return (SharedReport) jt.queryForObject(sql, new Object[]{ shareKey }, new SharedReportRawMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_shared_report WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    public int deleteByUserId(long userId) {
        String sql = "DELETE FROM p_shared_report WHERE user_id=?";
        return jt.update(sql, new Object[]{ userId });
    }

    public int deleteByReportId(long reportId) {
        String sql = "DELETE FROM p_shared_report WHERE report_id=?";
        return jt.update(sql, new Object[]{ reportId });
    }

    private static class SharedReportRawMapper implements RowMapper<SharedReport> {
        @Override
        public SharedReport mapRow(ResultSet rs, int i) throws SQLException {
            SharedReport r = new SharedReport();
            r.setId(rs.getLong(SharedReport.ID));
            r.setShareKey(rs.getString(SharedReport.SHARE_KEY));
            r.setReportType(rs.getString(SharedReport.REPORT_TYPE));
            r.setReportId(rs.getLong(SharedReport.REPORT_ID));
            r.setUserId(rs.getLong(SharedReport.USER_ID));
            r.setCreatedAt(rs.getLong(SharedReport.CREATED_AT));
            r.setExpiredBy(rs.getLong(SharedReport.EXPIRED_BY));
            return r;
        }
    }

    private static class SharedReportRowMapper implements RowMapper<SharedReportRow> {
        @Override
        public SharedReportRow mapRow(ResultSet rs, int i) throws SQLException {
            SharedReportRow r = new SharedReportRow();
            r.setId(rs.getLong(SharedReport.ID));
            r.setShareKey(rs.getString(SharedReport.SHARE_KEY));
            r.setReportName(rs.getString(SharedReportRow.REPORT_NAME));
            r.setReportType(rs.getString(SharedReport.REPORT_TYPE));
            r.setCreatedBy(rs.getString(SharedReportRow.CREATED_BY));
            long createdAt = rs.getLong(SharedReport.CREATED_AT);
            r.setCreateDateTime(CommonUtils.toReadableDateTime(CommonUtils.fromEpoch(createdAt)));
            long expiredBy = rs.getLong(SharedReport.EXPIRED_BY);
            r.setExpirationDate(CommonUtils.toReadableDate(CommonUtils.fromEpoch(expiredBy)));
            return r;
        }
    }
}
