package com.shzlw.poli.rest;

import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.service.DashboardService;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ws/widget")
public class WidgetWs {

    @Autowired
    WidgetDao widgetDao;

    @Autowired
    DashboardService dashboardService;

    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public Widget one(@PathVariable("id") long id) {
        return widgetDao.findById(id);
    }

    @RequestMapping(value = "/dashboard/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public ResponseEntity<?> findByDashboardId(@PathVariable("id") long dashboardId,
                                               HttpServletRequest request) {
        User user = (User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER);
        List<Dashboard> dashboards = dashboardService.getDashboardsByUser(user);
        boolean isFound = dashboards.stream().anyMatch(d -> d.getId() == dashboardId);
        if (isFound) {
            List<Widget> widgets = widgetDao.findByDashboardId(dashboardId);
            return new ResponseEntity<>(widgets, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Widget widget) {
        long id = widgetDao.insert(widget);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Widget widget) {
        widgetDao.update(widget);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        widgetDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/position", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<?> updatePositions(@RequestBody List<Widget> widgets) {
        for (Widget widget : widgets) {
            widgetDao.updatePosition(widget);
        }
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value="/download", method= RequestMethod.GET)
    @Transactional(readOnly = true)
    public void downloadCsv(@RequestParam("widgetId") long widgetId,
                            @RequestParam(value = "name", required = false) String name,
                            @RequestParam(value = "includeHeader", required = false) boolean includeHeader,
                            HttpServletResponse response) throws IOException {
        String csvText = "";
        String fileName = "";

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", String.format("attachment; filename=\"" + fileName +"\""));

        response.getWriter().write(csvText);
    }
}
