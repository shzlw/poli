package com.shzlw.poli;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "poli")
public class SystemProperties {

    Integer dataSourceMaximumPoolSize;

    public SystemProperties() {
        dataSourceMaximumPoolSize = 10;
    }

    public Integer getDataSourceMaximumPoolSize() {
        return dataSourceMaximumPoolSize;
    }

    public void setDataSourceMaximumPoolSize(Integer dataSourceMaximumPoolSize) {
        this.dataSourceMaximumPoolSize = dataSourceMaximumPoolSize;
    }
}
