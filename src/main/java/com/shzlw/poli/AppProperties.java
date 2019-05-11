package com.shzlw.poli;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "poli")
public class AppProperties {

    Integer dataSourceMaximumPoolSize;

    public AppProperties() {
        dataSourceMaximumPoolSize = 50;
    }

    public Integer getDataSourceMaximumPoolSize() {
        return dataSourceMaximumPoolSize;
    }

    public void setDataSourceMaximumPoolSize(Integer dataSourceMaximumPoolSize) {
        this.dataSourceMaximumPoolSize = dataSourceMaximumPoolSize;
    }
}
