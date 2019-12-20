package com.shzlw.poli.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import lombok.extern.slf4j.Slf4j;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class UserDaoTest {

	@Autowired
	UserDao userDao;

	@Test
	public void saveGroupDao() {
		long i = userDao.deleteUser(1);
		log.info("######" + i);
	}

}
