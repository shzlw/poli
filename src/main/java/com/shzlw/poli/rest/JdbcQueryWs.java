package com.shzlw.poli.rest;

import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.dto.WidgetQueryResult;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.DashboardService;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.util.List;

@RestController
@RequestMapping("/ws/jdbcquery")
public class JdbcQueryWs {

    private static final Logger LOGGER = LoggerFactory.getLogger(JdbcQueryWs.class);

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    WidgetDao widgetDao;

    @Autowired
    DashboardService dashboardService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public QueryResult runQuery(@RequestBody QueryRequest queryRequest) {
        long dataSourceId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        DataSource dataSource = jdbcDataSourceService.getDataSource(dataSourceId);
        QueryResult queryResult = jdbcQueryService.queryBySql(dataSource, sql);
        return queryResult;
    }

    @RequestMapping(value = "/widget/{id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WidgetQueryResult> queryWidget(@PathVariable("id") long widgetId,
                                                         @RequestBody List<FilterParameter> filterParams,
                                                         HttpServletRequest request) {
        Widget widget = widgetDao.findById(widgetId);
        if (widget.getJdbcDataSourceId() == 0) {
            return new ResponseEntity(new WidgetQueryResult(widgetId, "No data source found"), HttpStatus.OK);
        }

        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        List<Dashboard> dashboards = dashboardService.getDashboardsByUser(user);
        boolean isFound = false;
        for (Dashboard dashboard : dashboards) {
            if (dashboard.getId() == widget.getDashboardId()) {
                isFound = true;
                break;
            }
        }

        if (isFound) {
            String sql = widget.getSqlQuery();
            DataSource dataSource = jdbcDataSourceService.getDataSource(widget.getJdbcDataSourceId());
            WidgetQueryResult queryResult = jdbcQueryService.queryWidgetByParams(widgetId, dataSource, sql, filterParams);
            return new ResponseEntity(queryResult, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
