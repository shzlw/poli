package com.shzlw.poli;

import com.shzlw.poli.filter.AuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/");
        registry.addViewController("/**/{spring:\\w+}")
                .setViewName("forward:/");
        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
                .setViewName("forward:/");
    }

    @Bean
    public FilterRegistrationBean authFilterRegistry() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setName("authFilter");
        registration.setFilter(new AuthFilter());
        registration.addUrlPatterns("/*");
        registration.setAsyncSupported(Boolean.TRUE);
        registration.setEnabled(Boolean.TRUE);
        return registration;
    }
}
