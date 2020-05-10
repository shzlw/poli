package com.shzlw.poli.rest;

import com.shzlw.poli.dao.AuditLogDao;
import com.shzlw.poli.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ws/audit-logs")
public class AuditLogWs {

    @Autowired
    AuditLogDao auditLogDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<AuditLog> findAll(@RequestParam(name = "search", defaultValue = "", required = false) String searchValue,
                                  @RequestParam(name = "page", defaultValue = "1", required = false) int page,
                                  @RequestParam(name = "size", defaultValue = "20", required = false) int pageSize) {
        return auditLogDao.findAll(page, pageSize, searchValue);
    }
}
