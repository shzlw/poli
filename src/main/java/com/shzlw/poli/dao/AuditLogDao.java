package com.shzlw.poli.dao;

import com.shzlw.poli.model.AuditLog;
import com.shzlw.poli.util.CommonUtils;
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
public class AuditLogDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<AuditLog> findAll(int page, int pageSize, String searchValue) {
        String sql = "SELECT id, created_at, type, data "
                    + "FROM p_audit_log "
                    + "WHERE data LIKE :data "
                    + "OR type LIKE :type "
                    + "ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("data", DaoHelper.getLikeParam(searchValue));
        params.addValue("type", DaoHelper.getLikeParam(searchValue));
        params.addValue("offset", DaoHelper.toOffset(page, pageSize));
        params.addValue("limit", DaoHelper.toLimit(pageSize));

        return npjt.query(sql, params, new AuditLogMapper());
    }

    public long insert(long createdAt, String type, String data) {
        String sql = "INSERT INTO p_audit_log(created_at, type, data) "
                    + "VALUES(:created_at, :type, :data)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(AuditLog.CREATED_AT, createdAt);
        params.addValue(AuditLog.TYPE, type);
        params.addValue(AuditLog.DATA, data);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { AuditLog.ID });
        return keyHolder.getKey().longValue();
    }

    private static class AuditLogMapper implements RowMapper<AuditLog> {
        @Override
        public AuditLog mapRow(ResultSet rs, int i) throws SQLException {
            AuditLog r = new AuditLog();
            r.setId(rs.getLong(AuditLog.ID));
            r.setType(rs.getString(AuditLog.TYPE));
            long createdAt = rs.getLong(AuditLog.CREATED_AT);
            r.setCreatedAt(CommonUtils.toReadableDateTime(CommonUtils.fromEpoch(createdAt)));
            r.setData(rs.getString(AuditLog.DATA));
            return r;
        }
    }
}
