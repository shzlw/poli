package com.shzlw.poli.rest;

import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Widget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ws/widget")
public class WidgetWs {

    @Autowired
    WidgetDao widgetDao;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Widget one(@PathVariable("id") long id) {
        return widgetDao.findById(id);
    }

    @RequestMapping(value = "/dashboard/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Widget> allByDashboardId(@PathVariable("id") long id) {
        return widgetDao.findByDashboardId(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Widget widget) {
        widget.setX(0);
        widget.setY(0);
        widget.setWidth(200);
        widget.setHeight(200);
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
    public ResponseEntity<?> updatePos(@RequestBody List<Widget> widgets) {
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
