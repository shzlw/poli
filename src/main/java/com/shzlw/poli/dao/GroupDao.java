package com.shzlw.poli.dao;

import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.Group;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Repository
public class GroupDao {

    @Autowired
    JdbcTemplate jt;

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

    public List<Long> findGroupDashboards(long groupId) {
        String sql = "SELECT dashboard_id FROM p_group_dashboard WHERE group_id = ?";
        return jt.queryForList(sql, new Object[]{ groupId }, Long.class);
    }

    public long insertGroup(String name) {
        String sql = "INSERT INTO p_group(name) VALUES(?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jt.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }

    public void insertGroupDashboards(long groupId, List<Long> groupDashboards) {
        String sql = "INSERT INTO p_group_dashboard(group_id, dashboard_id) VALUES(?, ?)";
        // TODO: batch
        for (Long dashboardId: groupDashboards) {
            jt.update(sql, new Object[]{ groupId, dashboardId });
        }
    }

    public int updateGroup(Group group) {
        String sql = "UPDATE p_group SET name=? WHERE id=?";
        return jt.update(sql, new Object[]{ group.getName(), group.getId() });
    }

    public int deleteGroupUsers(long groupId) {
        String sql = "DELETE FROM p_group_user WHERE group_id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    public int deleteGroupDashboards(long groupId) {
        String sql = "DELETE FROM p_group_dashboard WHERE group_id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    public int deleteGroup(long groupId) {
        String sql = "DELETE FROM p_group WHERE id=?";
        return jt.update(sql, new Object[]{ groupId });
    }

    public List<Group> findAllWithDashboards() {
        String sql = "SELECT gd.dashboard_id, g.id, g.name "
                + "FROM p_group_dashboard gd "
                + "LEFT JOIN p_group g ON gd.group_id = g.id";
        List<GroupDashboardDto> groupDashboardDtos = jt.query(sql, new Object[] {}, new GroupDashboardMapper());
        Map<Long, Group> groupMap = new TreeMap<>();
        for (GroupDashboardDto gd : groupDashboardDtos) {
            long groupId = gd.getGroupId();
            Group group = groupMap.computeIfAbsent(groupId, key -> {
                Group newGroup = new Group();
                newGroup.setId(groupId);
                newGroup.setName(gd.getGroupName());
                return newGroup;
            });
            group.getGroupDashboards().add(gd.getDashboardId());
        }
        return new ArrayList<>(groupMap.values());
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

    private static class GroupDashboardDto {
        private long groupId;
        private String groupName;
        private long dashboardId;

        public GroupDashboardDto(long groupId, String groupName, long dashboardId) {
            this.groupId = groupId;
            this.groupName = groupName;
            this.dashboardId = dashboardId;
        }

        public long getGroupId() {
            return groupId;
        }

        public String getGroupName() {
            return groupName;
        }

        public long getDashboardId() {
            return dashboardId;
        }
    }

    private static class GroupDashboardMapper implements RowMapper<GroupDashboardDto> {
        @Override
        public GroupDashboardDto mapRow(ResultSet rs, int i) throws SQLException {
            GroupDashboardDto r = new GroupDashboardDto(
                    rs.getLong("id"),
                    rs.getString("name"),
                    rs.getLong("dashboard_id")
            );
            return r;
        }
    }
}