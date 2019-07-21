package com.shzlw.poli.rest;

import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.model.UserAttribute;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.util.CommonUtil;
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
import java.util.ArrayList;
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
            User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
            List<FilterParameter> newFilterParams = addUserAttributesToFilterParams(user.getUserAttributes(), filterParams);
            QueryResult queryResult = jdbcQueryService.queryComponentByParams(dataSource, sql, newFilterParams);
            return new ResponseEntity(queryResult, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
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

    protected List<FilterParameter> addUserAttributesToFilterParams(List<UserAttribute> userAttributes, List<FilterParameter> filterParams) {
        if (userAttributes == null || userAttributes.isEmpty()) {
            return filterParams;
        }

        List<FilterParameter> newFilterParams = new ArrayList<>();
        for (UserAttribute attr : userAttributes) {
            // Transform every user attribute to a single value filter param.
            FilterParameter param = new FilterParameter();
            param.setType(Constants.FILTER_TYPE_USER_ATTRIBUTE);
            // For example: $user_attr[division]
            param.setParam(CommonUtil.getParamByAttrKey(attr.getAttrKey()));
            param.setValue(attr.getAttrValue());
            newFilterParams.add(param);
        }

        if (filterParams != null && !filterParams.isEmpty()) {
            newFilterParams.addAll(filterParams);
        }

        return newFilterParams;
    }
}
