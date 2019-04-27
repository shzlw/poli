package com.shzlw.poli;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.service.JdbcDataSourceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StartUpListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StartUpListener.class);

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEvent () {
        LOGGER.info("[poli] starts up...");
        /*
        List<JdbcDataSource> dataSourceList = jdbcDataSourceDao.findAll();
        for (JdbcDataSource ds : dataSourceList) {
            jdbcDataSourceService.putInCache(ds);
        }
        */
    }
}