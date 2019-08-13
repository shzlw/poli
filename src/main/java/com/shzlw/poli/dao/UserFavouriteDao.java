package com.shzlw.poli.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserFavouriteDao {

    @Autowired
    JdbcTemplate jt;

    public boolean isFavourite(long userId, long reportId) {
        String sql = "SELECT COUNT(1) FROM p_user_favourite WHERE user_id=? AND report_id=?";
        int count = jt.queryForObject(sql, new Object[]{ userId, reportId }, Integer.class);
        return count != 0;
    }

    public int insertFavourite(long userId, long reportId) {
        String sql = "INSERT INTO p_user_favourite(user_id, report_id) VALUES(?, ?)";
        return jt.update(sql, new Object[]{ userId, reportId });
    }

    public int deleteFavourite(long userId, long reportId) {
        String sql = "DELETE FROM p_user_favourite WHERE user_id=? AND report_id=?";
        return jt.update(sql, new Object[]{ userId, reportId });
    }

    public int deleteByUserId(long userId) {
        String sql = "DELETE FROM p_user_favourite WHERE user_id=?";
        return jt.update(sql, new Object[]{ userId });
    }

    public int deleteByReportId(long reportId) {
        String sql = "DELETE FROM p_user_favourite WHERE report_id=?";
        return jt.update(sql, new Object[]{ reportId });
    }
}
