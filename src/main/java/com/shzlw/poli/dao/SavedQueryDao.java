package com.shzlw.poli.dao;

import com.shzlw.poli.model.SavedQuery;
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
public class SavedQueryDao {

    @Autowired
    JdbcTemplate jt;

    @Autowired
    NamedParameterJdbcTemplate npjt;

    public List<SavedQuery> findAll() {
        String sql = "SELECT id, name, endpoint_name "
                    + "FROM p_saved_query "
                    + "ORDER BY id DESC";

        MapSqlParameterSource params = new MapSqlParameterSource();

        return npjt.query(sql, params, (rs, i) -> {
            SavedQuery r = new SavedQuery();
            r.setId(rs.getLong(SavedQuery.ID));
            r.setName(rs.getString(SavedQuery.NAME));
            r.setEndpointName(rs.getString(SavedQuery.ENDPOINT_NAME));
            return r;
        });
    }

    public List<SavedQuery> findAllByPage(int page, int pageSize, String searchValue) {
        String sql = "SELECT id, name, endpoint_name "
                    + "FROM p_saved_query "
                    + "WHERE name LIKE :name "
                    + "ORDER BY id DESC LIMIT :limit OFFSET :offset";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("name", DaoHelper.getLikeParam(searchValue));
        params.addValue("offset", DaoHelper.toOffset(page, pageSize));
        params.addValue("limit", DaoHelper.toLimit(pageSize));

        return npjt.query(sql, params, (rs, i) -> {
            SavedQuery r = new SavedQuery();
            r.setId(rs.getLong(SavedQuery.ID));
            r.setName(rs.getString(SavedQuery.NAME));
            r.setEndpointName(rs.getString(SavedQuery.ENDPOINT_NAME));
            return r;
        });
    }

    public SavedQuery find(long id) {
        String sql = "SELECT id, name, endpoint_name, endpoint_accesscode, sql_query, datasource_id "
                    + "FROM p_saved_query "
                    + "WHERE id = ?";
        try {
            return (SavedQuery) jt.queryForObject(sql, new Object[]{ id }, (rs, i) -> {
                SavedQuery r = new SavedQuery();
                r.setId(rs.getLong(SavedQuery.ID));
                r.setName(rs.getString(SavedQuery.NAME));
                r.setEndpointName(rs.getString(SavedQuery.ENDPOINT_NAME));
                r.setEndpointAccessCode(rs.getString(SavedQuery.ENDPOINT_ACCESSCODE));
                r.setSqlQuery(rs.getString(SavedQuery.SQL_QUERY));
                r.setJdbcDataSourceId(rs.getLong(SavedQuery.DATASOURCE_ID));
                return r;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public SavedQuery findByEndpointName(String endpointName) {
        String sql = "SELECT sql_query, datasource_id, endpoint_accesscode "
                    + "FROM p_saved_query "
                    + "WHERE endpoint_name = ?";
        try {
            return (SavedQuery) jt.queryForObject(sql, new Object[]{ endpointName }, (rs, i) -> {
                SavedQuery r = new SavedQuery();
                r.setSqlQuery(rs.getString(SavedQuery.SQL_QUERY));
                r.setJdbcDataSourceId(rs.getLong(SavedQuery.DATASOURCE_ID));
                r.setEndpointAccessCode(rs.getString(SavedQuery.ENDPOINT_ACCESSCODE));
                return r;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public long insert(SavedQuery savedQuery) {
        String sql = "INSERT INTO p_saved_query(name, sql_query, datasource_id, endpoint_name, endpoint_accesscode) "
                    + " VALUES(:name, :sql_query, :datasource_id, :endpoint_name, :endpoint_accesscode)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(SavedQuery.NAME, savedQuery.getName());
        params.addValue(SavedQuery.SQL_QUERY, savedQuery.getSqlQuery());
        params.addValue(SavedQuery.DATASOURCE_ID, savedQuery.getJdbcDataSourceId());
        params.addValue(SavedQuery.ENDPOINT_NAME, savedQuery.getEndpointName());
        params.addValue(SavedQuery.ENDPOINT_ACCESSCODE, savedQuery.getEndpointAccessCode());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        npjt.update(sql, params, keyHolder, new String[] { SavedQuery.ID });
        return keyHolder.getKey().longValue();
    }

    public int update(SavedQuery savedQuery) {
        String sql = "UPDATE p_saved_query SET datasource_id=?, name=?, sql_query=?, endpoint_name=?, endpoint_accesscode=? WHERE id=?";
        return jt.update(sql, new Object[]{
                savedQuery.getJdbcDataSourceId(),
                savedQuery.getName(),
                savedQuery.getSqlQuery(),
                savedQuery.getEndpointName(),
                savedQuery.getEndpointAccessCode(),
                savedQuery.getId()
        });
    }

    public int clearDataSourceId(long dataSourceId) {
        String sql = "UPDATE p_saved_query SET dataSource_id = NULL WHERE dataSource_id = ?";
        return jt.update(sql, new Object[]{ dataSourceId });
    }

    public int delete(long id) {
        String sql = "DELETE FROM p_saved_query WHERE id=?";
        return jt.update(sql, new Object[]{ id });
    }

    private static class SavedQueryMapper implements RowMapper<SavedQuery> {
        @Override
        public SavedQuery mapRow(ResultSet rs, int i) throws SQLException {
            SavedQuery r = new SavedQuery();
            r.setId(rs.getLong(SavedQuery.ID));
            r.setName(rs.getString(SavedQuery.NAME));
            r.setSqlQuery(rs.getString(SavedQuery.SQL_QUERY));
            r.setJdbcDataSourceId(rs.getLong(SavedQuery.DATASOURCE_ID));
            r.setEndpointName(rs.getString(SavedQuery.ENDPOINT_NAME));
            return r;
        }
    }
}
