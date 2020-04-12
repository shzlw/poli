package com.shzlw.poli.config;

import com.shzlw.poli.filter.AuthFilter;
import okhttp3.OkHttpClient;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // \\w+ regex does not match the hyphen or underscore. Replace \\w for ^[a-zA-Z\d-_]
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

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
    }
}
