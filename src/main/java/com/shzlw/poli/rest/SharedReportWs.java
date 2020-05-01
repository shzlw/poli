package com.shzlw.poli.rest;

import com.shzlw.poli.dao.SharedReportDao;
import com.shzlw.poli.dto.SharedReportRow;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.model.User;
import com.shzlw.poli.service.SharedReportService;
import com.shzlw.poli.util.CommonUtils;
import com.shzlw.poli.util.Constants;
import com.shzlw.poli.util.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ws/sharedreports")
public class SharedReportWs {

    @Autowired
    SharedReportDao sharedReportDao;

    @Autowired
    SharedReportService sharedReportService;

    @RequestMapping(value="/generate-sharekey", method = RequestMethod.POST)
    @Transactional
    public String generateSharedReportUrl(@RequestBody SharedReport sharedReport,
                                          HttpServletRequest request) {
        // Try reuse the same share key if it's the same report and has the same expiration date.
        List<SharedReport> sharedReports = sharedReportDao.findByReportId(sharedReport.getReportId());
        String newExpirationDate = CommonUtils.toReadableDateTime(CommonUtils.fromEpoch(sharedReport.getExpiredBy()));
        for (SharedReport sr : sharedReports) {
            String expirationDate = CommonUtils.toReadableDateTime(CommonUtils.fromEpoch(sr.getExpiredBy()));
            if (newExpirationDate.equals(expirationDate)) {
                return sr.getShareKey();
            }
        }

        // Create a new shared report.
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        String shareKey = Constants.SHARE_KEY_PREFIX + PasswordUtils.getUniqueId();
        long createdAt = CommonUtils.toEpoch(LocalDateTime.now());
        sharedReportDao.insert(shareKey, sharedReport.getReportId(), sharedReport.getReportType(),
                user.getId(), createdAt, sharedReport.getExpiredBy());
        return shareKey;
    }

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<SharedReportRow> findAllSharedReports() {
        return sharedReportDao.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        SharedReport sharedReport = sharedReportDao.findById(id);
        sharedReportService.invalidateSharedLinkInfoCacheByShareKey(sharedReport.getShareKey());
        sharedReportDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
