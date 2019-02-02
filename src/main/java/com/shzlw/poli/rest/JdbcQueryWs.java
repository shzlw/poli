package com.shzlw.poli.rest;

import com.shzlw.poli.dao.FilterDao;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.Filter;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ws/jdbcquery")
public class JdbcQueryWs {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    WidgetDao widgetDao;

    @Autowired
    FilterDao filterDao;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public String runQuery(@RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getJdbcDataSourceId();
        String query = queryRequest.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchById(dsId);
        return jdbcQueryService.fetchJsonByQuery(ds, query);
    }

    @RequestMapping(value = "/widget/{id}", method = RequestMethod.GET)
    public QueryResult runWidgetQuery(@PathVariable("id") long widgetId) {
        Widget widget = widgetDao.fetchById(widgetId);
        String sql = widget.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchByWidgetId(widgetId);
        String data = jdbcQueryService.fetchJsonByQuery(ds, sql);
        return new QueryResult(widgetId, data);
    }

    @RequestMapping(value = "/filter/{id}", method = RequestMethod.POST)
    public QueryResult runWidgetQuery(@PathVariable("id") long filterId,
                                      @RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchById(dsId);
        String data = jdbcQueryService.fetchJsonByQuery(ds, sql);
        return new QueryResult(filterId, data);
    }
}
