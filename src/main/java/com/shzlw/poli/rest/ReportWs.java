package com.shzlw.poli.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.config.AppProperties;
import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dao.ReportDao;
import com.shzlw.poli.dao.SharedReportDao;
import com.shzlw.poli.dao.UserFavouriteDao;
import com.shzlw.poli.dto.ExportRequest;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.HttpClient;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.service.SharedReportService;
import com.shzlw.poli.util.CommonUtils;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ws/reports")
public class ReportWs {

    @Autowired
    ReportDao reportDao;

    @Autowired
    ComponentDao componentDao;

    @Autowired
    ReportService reportService;

    @Autowired
    SharedReportDao sharedReportDao;

    @Autowired
    UserFavouriteDao userFavouriteDao;

    @Autowired
    SharedReportService sharedReportService;

    @Autowired
    HttpClient httpClient;

    @Autowired
    AppProperties appProperties;

    @Autowired
    ObjectMapper mapper;

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
        Report report = reports.stream().filter(d -> d.getId() == id).findFirst().orElse(null);
        if (report != null) {
            User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
            boolean isFavourite = userFavouriteDao.isFavourite(user.getId(), report.getId());
            report.setFavourite(isFavourite);
            return report;
        }

        return null;
    }

    @RequestMapping(value = "/name/{name}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Report findOneByName(@PathVariable("name") String name,
                                HttpServletRequest request) {
        List<Report> reports = findAll(request);
        return reports.stream().filter(d -> d.getName().equals(name)).findFirst().orElse(null);
    }

    @RequestMapping(value = "/sharekey/{shareKey}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Report findOneBySharekey(@PathVariable("shareKey") String shareKey) {
        SharedReport sharedReport = sharedReportDao.findByShareKey(shareKey);
        if (sharedReport == null) {
            return null;
        }

        if (sharedReport.getExpiredBy() < CommonUtils.toEpoch(LocalDateTime.now())) {
            return null;
        }

        return reportDao.findById(sharedReport.getReportId());
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Report report,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        reportService.invalidateCache(user.getId());
        long id = reportDao.insert(report.getName(), report.getStyle(), report.getProject());
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
    public ResponseEntity<?> delete(@PathVariable("id") long reportId,
                                    HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        reportService.invalidateCache(user.getId());
        sharedReportService.invalidateSharedLinkInfoCacheByReportId(reportId);
        sharedReportDao.deleteByReportId(reportId);
        userFavouriteDao.deleteByReportId(reportId);
        componentDao.deleteByReportId(reportId);
        reportDao.delete(reportId);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/favourite/{id}/{status}", method = RequestMethod.POST)
    @Transactional
    public void updateFavourite(@PathVariable("id") long reportId,
                                @PathVariable("status") String status,
                                HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        long userId = user.getId();
        if (status.equals("add")) {
            if (!userFavouriteDao.isFavourite(userId, reportId)) {
                userFavouriteDao.insertFavourite(userId, reportId);
            }
        } else {
            userFavouriteDao.deleteFavourite(userId, reportId);
        }
    }

    @RequestMapping(value = "/favourite", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<Report> findAllFavourites(HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        return reportDao.findFavouritesByUserId(user.getId());
    }

    @RequestMapping(
            value = "/pdf",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_PDF_VALUE)
    @Transactional(readOnly = true)
    public ResponseEntity<?> exportToPdf(@RequestBody ExportRequest exportRequest,
                                         HttpServletRequest request) {

        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        exportRequest.setSessionKey(user.getSessionKey());

        try {
            byte[] pdfData = httpClient.postJson(appProperties.getExportServerUrl(), mapper.writeValueAsString(exportRequest));
            ByteArrayResource resource = new ByteArrayResource(pdfData);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + exportRequest.getReportName() + ".pdf");
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentLength(pdfData.length)
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(resource);
        } catch (IOException e) {
            return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
        }
    }
}
