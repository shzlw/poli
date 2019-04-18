package com.shzlw.poli.rest;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public QueryResult runQuery(@RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.findById(dsId);
        QueryResult queryResult = jdbcQueryService.fetchJsonByQuery(ds, sql);
        return queryResult;
    }

    @RequestMapping(value = "/widget/{id}", method = RequestMethod.POST)
    public QueryResult queryWidget(@PathVariable("id") long widgetId,
                                        @RequestBody List<FilterParameter> filterParams) {
        Widget widget = widgetDao.findById(widgetId);
        String sql = widget.getSqlQuery();
        JdbcDataSource ds = jdbcDataSourceDao.findByWidgetId(widgetId);
        QueryResult queryResult = jdbcQueryService.fetchJsonWithParams(ds, sql, filterParams);
        queryResult.setId(widgetId);
        return queryResult;
    }
}
