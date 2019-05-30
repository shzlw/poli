package com.shzlw.poli.rest;

import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.util.Date;
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
    ComponentDao componentDao;

    @Autowired
    ReportService reportService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public QueryResult runQuery(@RequestBody QueryRequest queryRequest) {
        long dataSourceId = queryRequest.getJdbcDataSourceId();
        String sql = queryRequest.getSqlQuery();
        DataSource dataSource = jdbcDataSourceService.getDataSource(dataSourceId);
        QueryResult queryResult = jdbcQueryService.queryComponentByParams(dataSource, sql, null);
        return queryResult;
    }

    @RequestMapping(
            value = "/component/{id}",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QueryResult> queryComponent(
            @PathVariable("id") long componentId,
            @RequestBody List<FilterParameter> filterParams,
            HttpServletRequest request
    ) {
        Component component = componentDao.findById(componentId);
        if (component.getJdbcDataSourceId() == 0) {
            return new ResponseEntity(QueryResult.ofError(Constants.ERROR_NO_DATA_SOURCE_FOUND), HttpStatus.OK);
        }

        boolean isAccessValid = isComponentAccessValid(component, request);
        if (isAccessValid) {
            String sql = component.getSqlQuery();
            DataSource dataSource = jdbcDataSourceService.getDataSource(component.getJdbcDataSourceId());
            QueryResult queryResult = jdbcQueryService.queryComponentByParams(dataSource, sql, filterParams);
            return new ResponseEntity(queryResult, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @RequestMapping(
            value = "/component/{id}/csv",
            method = RequestMethod.POST)
    public void downloadComponent(
            @PathVariable("id") long componentId,
            @RequestBody List<FilterParameter> filterParams,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        Component component = componentDao.findById(componentId);
        boolean isAccessValid = isComponentAccessValid(component, request);

        if (isAccessValid) {
            String sql = component.getSqlQuery();
            DataSource dataSource = jdbcDataSourceService.getDataSource(component.getJdbcDataSourceId());
            QueryResult queryResult = jdbcQueryService.queryComponentByParams(dataSource, sql, filterParams);
            String csvText = queryResult.getData();
            String fileName = component.getTitle() + "_" + new Date();

            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", String.format("attachment; filename=\"" + fileName +"\""));

            response.getWriter().write(csvText);
        }
    }

    protected boolean isComponentAccessValid(Component component, HttpServletRequest request) {
        if (component == null) {
            return false;
        }

        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        if (user == null) {
            return false;
        }

        List<Report> reports = reportService.getReportsByUser(user);
        boolean isValid = false;
        for (Report report : reports) {
            if (report.getId() == component.getReportId()) {
                isValid = true;
                break;
            }
        }
        return isValid;
    }
}
