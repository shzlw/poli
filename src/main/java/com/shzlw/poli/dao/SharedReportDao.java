package com.shzlw.poli.dao;

import com.shzlw.poli.dto.SharedReportRow;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.util.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
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
        String sql = "SELECT rs.id, share_key, r.name AS report_name, rs.report_type, u.username AS created_by, rs.created_at, rs.expired_by "
                    + "FROM p_shared_report rs "
                    + "LEFT JOIN p_user u ON rs.user_id = u.id "
                    + "LEFT JOIN p_report r ON rs.report_id = r.id "
                    + "ORDER BY rs.created_at DESC";
        return jt.query(sql, new Object[] {}, new SharedReportRowMapper());
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
            r.setCreateDateTime(CommonUtil.toReadableDateTime(CommonUtil.fromEpoch(createdAt)));
            long expiredBy = rs.getLong(SharedReport.EXPIRED_BY);
            r.setExpirationDate(CommonUtil.toReadableDate(CommonUtil.fromEpoch(expiredBy)));
            return r;
        }
    }
}
