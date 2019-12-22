package com.shzlw.poli.dao;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import lombok.extern.slf4j.Slf4j;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class UserDaoTest {

	@Autowired
	UserDao userDao;
	
    @Autowired
    JdbcTemplate jt;

//	@Test
//	public void saveGroupDao() {
//		long i = userDao.deleteUser(1);
//		log.info("######" + i);
//	}
	@Test
	public void saveDict(){
		List list=new ArrayList();
	try {
		  list=getReadMnums();
	} catch (ClassNotFoundException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (NoSuchMethodException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IllegalAccessException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (InvocationTargetException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
		for(int i=0;i<list.size();i++) {
			Map map=(Map) list.get(i);
			String[] className=((String) map.get("className")).split("\\$");
			
		String sql="\n" + 
				"INSERT INTO `dict_dictionary_details` ( `class_name`, `name`, `code`, `index`, `create_time`, `update_time`)\n" + 
				"VALUES\n" + 
				"	( '"+className[1]+"', '"+map.get("name")+"', '"+map.get("code")+"', '"+map.get("index")+"', NULL, NULL);";
		jt.batchUpdate(sql);
		}
		System.out.println("###########"+list.size());
	}
	/**
	 * 读取枚举类
	 * @return
	 * @throws ClassNotFoundException
	 * @throws NoSuchMethodException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	private static List<Map> getReadMnums()
			throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
		Class c2 = Class.forName("com.shzlw.poli.dao.BasicsEnum");
		// 获取常量类中的所有内部类
		Class innerClazz[] = c2.getDeclaredClasses();
		System.out.println(innerClazz.length);
		List<Map> list = new ArrayList<>();
		for (Class class1 : innerClazz) {
			// 判断类是不是枚举类
			if (class1.isEnum()) {
				// 获取内部内的类名，在这里其实就是获取枚举类
				String simpleName = class1.getSimpleName();
				// 反射获取枚举类
				Class<Enum> clazz = (Class<Enum>) Class.forName("com.shzlw.poli.dao.BasicsEnum$" + simpleName);
				// 获取所有枚举实例
				Enum[] enumConstants = clazz.getEnumConstants();
				// 根据方法名获取方法
				Method getCode = clazz.getMethod("getDesc");
				Method getIndex = clazz.getMethod("getIndex");
				System.out.println("####.enumConstants.length=" + enumConstants.length);
				
				for (Enum enum1 : enumConstants) {
					Map<String, String> map = new HashMap<>();
					String className = enum1.getDeclaringClass().getName();
					// 得到枚举实例名
					String name2 = enum1.name();
					// 执行枚举方法获得枚举实例对应的值
					Object code = getCode.invoke(enum1);
					Object index = getIndex.invoke(enum1);
					System.out.print("######className=" + className + "----");
					System.out.println(name2 + ":" + code.toString() + "======" + index.toString());
					map.put("className", className);
					map.put("name", name2);
					map.put("code", code.toString());
					map.put("index", index.toString());
					list.add(map);
					
				}
			}
			
		}
		System.out.println(list.size());
		return list;
	}
}
