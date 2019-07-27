package com.shzlw.poli.dao;

import com.shzlw.poli.model.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class GroupDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<Group> findAll() {
        String sql = "SELECT id, name FROM p_group";
        return jt.query(sql, new Object[] {}, new GroupRowMapper());
    }

    public Group findById(long groupId) {
        String sql = "SELECT id, name FROM p_group WHERE id=?";
        try {
            return (Group) jt.queryForObject(sql, new Object[]{ groupId }, new GroupRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Long> findGroupReports(long groupId) {
        String sql = "SELECT report_id FROM p_group_report WHERE group_id = ?";
        return jt.queryForList(sql, new Object[]{ groupId }, Long.class);
    }

    public long insertGroup(String name) {
        String sql = "INSERT INTO p_group(name) VALUES(:name)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(Group.NAME, name);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { Group.ID});
        return keyHolder.getKey().longValue();
    }

    public void insertGroupReports(long groupId, List<Long> groupReports) {
        String sql = "INSERT INTO p_group_report(group_id, report_id) VALUES(?, ?)";
        jt.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setLong(1, groupId);
                ps.setLong(2, groupReports.get(i));
            }

            @Override
            public int getBatchSize() {
                return groupReports.size();
            }
        });
    }

    public int updateGroup(Group group) {
        String sql = "UPDATE p_group SET name=? WHERE id=?";
        return jt.update(sql, new Object[]{ group.getName(), group.getId() });
    }

    public int deleteGroupUsers(long groupId) {
        String sql = "DELETE FROM p_group_user WHERE group_id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    public int deleteGroupReports(long groupId) {
        String sql = "DELETE FROM p_group_report WHERE group_id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    public int deleteGroup(long groupId) {
        String sql = "DELETE FROM p_group WHERE id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    private static class GroupRowMapper implements RowMapper<Group> {
        @Override
        public Group mapRow(ResultSet rs, int i) throws SQLException {
            Group r = new Group();
            r.setId(rs.getLong(Group.ID));
            r.setName(rs.getString(Group.NAME));
            return r;
        }
    }
}