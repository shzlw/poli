package com.shzlw.poli.dao;

import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDao {

    @Autowired
    NamedParameterJdbcTemplate jt;
}
