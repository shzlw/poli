package com.shzlw.poli.config;

import com.ptc.board.log.web.TraceLogContextFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 配置拦截器
 */
@Configuration
public class FilterLogConfig {

    /**
     * 拦截器注册
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean myOncePerRequestFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(traceLogContextFilter());
        registration.addUrlPatterns("/*");// 拦截路径
        registration.setName("TraceLogContextFilter");// 拦截器名称
        registration.setOrder(2);// 顺序
        return registration;
    }

    @Bean
    public TraceLogContextFilter traceLogContextFilter() {
        return new TraceLogContextFilter();
    }
}
