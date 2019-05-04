package com.shzlw.poli.rest;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.dto.WidgetQueryResult;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.List;

@RestController
@RequestMapping("/ws/jdbcquery")
public class JdbcQueryWs {

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    WidgetDao widgetDao;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public QueryResult runQuery(@RequestBody QueryRequest queryRequest) {
        long dataSourceId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        DataSource dataSource = jdbcDataSourceService.getDataSource(dataSourceId);
        QueryResult queryResult = jdbcQueryService.queryBySql(dataSource, sql);
        return queryResult;
    }

    @RequestMapping(value = "/widget/{id}", method = RequestMethod.POST)
    public WidgetQueryResult queryWidget(@CookieValue(Constants.SESSION_KEY) String sessionKey,
                                         @PathVariable("id") long widgetId,
                                         @RequestBody List<FilterParameter> filterParams) {
        Widget widget = widgetDao.findById(widgetId);
        if (widget.getJdbcDataSourceId() == 0) {
            return new WidgetQueryResult(widgetId, "No data source found");
        }

        String sql = widget.getSqlQuery();
        DataSource dataSource = jdbcDataSourceService.getDataSource(widget.getJdbcDataSourceId());
        WidgetQueryResult queryResult = jdbcQueryService.queryWidgetByParams(widgetId, dataSource, sql, filterParams);
        return queryResult;
    }
}
