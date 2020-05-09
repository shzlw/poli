package com.shzlw.poli.service;

import com.shzlw.poli.dao.AuditLogDao;
import com.shzlw.poli.util.CommonUtils;
import com.shzlw.poli.util.HttpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    AuditLogDao auditLogDao;

    public void logQueryEndpointAccess(HttpServletRequest request, String name) {
        long now = CommonUtils.toEpoch(LocalDateTime.now());
        String ip = HttpUtils.getIpAddress(request);
        String ipAddress = ip == null ? "" : ip;
        String type = "query endpoint";
        String logData = String.format("%s accesses query endpoint: %s", ipAddress, name);
        auditLogDao.insert(now, type, logData);
    }
}
