package com.shzlw.poli.rest;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.dto.QueryRequest;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.JdbcQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ws/jdbcquery")
public class JdbcQueryWs {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcQueryService jdbcQueryService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public String runQuery(@RequestBody QueryRequest queryRequest) {
        long dsId = queryRequest.getId();
        String query = queryRequest.getQuery();
        JdbcDataSource ds = jdbcDataSourceDao.fetchById(dsId);
        return jdbcQueryService.fetchJsonByQuery(ds, query);
    }
}
