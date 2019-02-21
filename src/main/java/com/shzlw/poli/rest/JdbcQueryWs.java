package com.shzlw.poli.rest;

import com.shzlw.poli.dao.FilterDao;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.FilterParameter;
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

import java.util.List;

@RestController
@RequestMapping("/ws/jdbcquery")
public class JdbcQueryWs {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    WidgetDao widgetDao;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public String runQuery(@RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchById(dsId);
        QueryResult queryResult = jdbcQueryService.fetchJsonByQuery(ds, sql);
        return queryResult.getData();
    }

    @RequestMapping(value = "/widget/{id}", method = RequestMethod.POST)
    public QueryResult runWidgetQuery(@PathVariable("id") long widgetId,
                                      @RequestBody List<FilterParameter> filterParams) {
        Widget widget = widgetDao.fetchById(widgetId);
        String sql = widget.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchByWidgetId(widgetId);
        QueryResult queryResult = jdbcQueryService.fetchJsonWithParams(ds, sql, filterParams);
        queryResult.setId(widgetId);
        return queryResult;
    }

    @RequestMapping(value = "/filter/{id}", method = RequestMethod.POST)
    public QueryResult runWidgetQuery(@PathVariable("id") long filterId,
                                      @RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchById(dsId);
        QueryResult queryResult = jdbcQueryService.fetchJsonByQuery(ds, sql);
        queryResult.setId(filterId);
        return queryResult;
    }
}
