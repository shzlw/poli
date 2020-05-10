package com.shzlw.poli.rest.api;

import com.shzlw.poli.dao.SavedQueryDao;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.SavedQuery;
import com.shzlw.poli.service.AuditLogService;
import com.shzlw.poli.service.JdbcDataSourceService;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

@RestController
@RequestMapping("/api/v1")
public class SavedQueryEndpointWs {

    @Autowired
    SavedQueryDao savedQueryDao;

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @Autowired
    AuditLogService auditLogService;

    @RequestMapping(value = "/saved-queries", method = RequestMethod.GET)
    @Transactional
    public ResponseEntity<String> getSavedQuery(@RequestParam("name") String name,
                                               @RequestParam(name = "accessCode", required = false, defaultValue = "") String accessCode,
                                               @RequestParam(name = "contentType", required = false, defaultValue = "") String contentType,
                                               HttpServletRequest request) {

        auditLogService.logQueryEndpointAccess(request, name);

        SavedQuery savedQuery = savedQueryDao.findByEndpointName(name);
        if (savedQuery == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        // Validate access code
        String endpointAccessCode = savedQuery.getEndpointAccessCode();
        if (!StringUtils.isEmpty(endpointAccessCode) && !endpointAccessCode.equals(accessCode)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        DataSource dataSource = jdbcDataSourceService.getDataSource(savedQuery.getJdbcDataSourceId());
        if (dataSource == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        QueryResult queryResult = jdbcQueryService.executeQuery(dataSource, savedQuery.getSqlQuery(), contentType);
        if (queryResult.getError() != null) {
            return new ResponseEntity<>(queryResult.getError(), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(queryResult.getData(), HttpStatus.OK);
        }
    }
}
