package com.shzlw.poli.dao;

import com.shzlw.poli.dto.ReportShareRow;
import com.shzlw.poli.model.ReportShare;
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
public class ReportShareDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<ReportShareRow> findAll() {
        String sql = "SELECT rs.id, share_key, r.name AS report_name, rs.report_type, u.username AS created_by, rs.created_at, rs.expired_by "
                    + "FROM p_report_share rs "
                    + "LEFT JOIN p_user u ON rs.user_id = u.id "
                    + "LEFT JOIN p_report r ON rs.report_id = r.id "
                    + "ORDER BY rs.created_at DESC";
        return jt.query(sql, new Object[] {}, new ReportShareRowMapper());
    }

    public long insert(String shareKey, long reportId, String reportType, long userId, long createdAt, long expiredBy) {
        String sql = "INSERT INTO p_report_share(share_key, report_id, report_type, user_id, created_at, expired_by) "
                    + "VALUES(:share_key, :report_id, :report_type, :user_id, :created_at, :expired_by)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(ReportShare.SHARE_KEY, shareKey);
        params.addValue(ReportShare.REPORT_ID, reportId);
        params.addValue(ReportShare.REPORT_TYPE, reportType);
        params.addValue(ReportShare.USER_ID, userId);
        params.addValue(ReportShare.CREATED_AT, createdAt);
        params.addValue(ReportShare.EXPIRED_BY, expiredBy);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { ReportShare.ID });
        return keyHolder.getKey().longValue();
    }

    private static class ReportShareRowMapper implements RowMapper<ReportShareRow> {
        @Override
        public ReportShareRow mapRow(ResultSet rs, int i) throws SQLException {
            ReportShareRow r = new ReportShareRow();
            r.setId(rs.getLong(ReportShare.ID));
            r.setShareKey(rs.getString(ReportShare.SHARE_KEY));
            r.setReportName(rs.getString(ReportShareRow.REPORT_NAME));
            r.setReportType(rs.getString(ReportShare.REPORT_TYPE));
            r.setCreatedBy(rs.getString(ReportShareRow.CREATED_BY));
            long createdAt = rs.getLong(ReportShare.CREATED_AT);
            r.setCreateDateTime(CommonUtil.toReadableDateTime(CommonUtil.fromEpoch(createdAt)));
            long expiredBy = rs.getLong(ReportShare.EXPIRED_BY);
            r.setExpirationDate(CommonUtil.toReadableDate(CommonUtil.fromEpoch(expiredBy)));
            return r;
        }
    }
}
