package com.shzlw.poli.rest;

import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dao.ReportDao;
import com.shzlw.poli.dao.SharedReportDao;
import com.shzlw.poli.dto.SharedReportRow;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.util.CommonUtil;
import com.shzlw.poli.util.Constants;
import com.shzlw.poli.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ws/report")
public class ReportWs {

    @Autowired
    ReportDao reportDao;

    @Autowired
    ComponentDao componentDao;

    @Autowired
    ReportService reportService;

    @Autowired
    SharedReportDao sharedReportDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<Report> findAll(HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        return reportService.getReportsByUser(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Report findOneById(@PathVariable("id") long id,
                                 HttpServletRequest request) {
        List<Report> reports = findAll(request);
        return reports.stream().filter(d -> d.getId() == id).findFirst().orElse(null);
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Report findOneByName(@PathVariable("name") String name,
                                   HttpServletRequest request) {
        List<Report> reports = findAll(request);
        return reports.stream().filter(d -> d.getName().equals(name)).findFirst().orElse(null);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Report report,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        reportService.invalidateCache(user.getId());
        long id = reportDao.insert(report.getName(), report.getStyle());
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Report report,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        reportService.invalidateCache(user.getId());
        reportDao.update(report);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        reportService.invalidateCache(user.getId());
        componentDao.deleteByReportId(id);
        reportDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/share", method = RequestMethod.POST)
    @Transactional
    public String generateSharedReportUrl(@RequestBody SharedReport sharedReport,
                                         HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        String shareKey = Constants.SHARE_KEY_PREFIX + PasswordUtil.getUniqueId();
        long createdAt = CommonUtil.toEpoch(LocalDateTime.now());
        sharedReportDao.insert(shareKey, sharedReport.getReportId(), sharedReport.getReportType(),
                user.getId(), createdAt, sharedReport.getExpiredBy());
        return shareKey;
    }

    @RequestMapping(value = "/share", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<SharedReportRow> findAllSharedReports() {
        return sharedReportDao.findAll();
    }
}
