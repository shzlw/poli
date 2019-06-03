package com.shzlw.poli;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "poli")
public class AppProperties {

    Integer datasourceMaximumPoolSize;

    public AppProperties() {
        datasourceMaximumPoolSize = 50;
    }

    public Integer getDatasourceMaximumPoolSize() {
        return datasourceMaximumPoolSize;
    }

    public void setDatasourceMaximumPoolSize(Integer datasourceMaximumPoolSize) {
        this.datasourceMaximumPoolSize = datasourceMaximumPoolSize;
    }
}
