package com.shzlw.poli.util;

import org.springframework.lang.Nullable;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public final class CommonUtil {

	private CommonUtil() {
	}

	public static LocalDateTime fromEpoch(long epoch) {
		return Instant.ofEpochMilli(epoch).atZone(ZoneId.systemDefault()).toLocalDateTime();
	}

	public static long toEpoch(@Nullable LocalDateTime dateTime) {
		return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
	}

	public static String toReadableDateTime(LocalDateTime localDateTime) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		return localDateTime.format(formatter);
	}

	public static String toReadableDate(LocalDateTime localDateTime) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		return localDateTime.format(formatter);
	}

	public static String getParamByAttrKey(String attrKey) {
		return "$user_attr[" + attrKey + "]";
	}

	public static List<String> getQueryStatements(String sql, Map<String, Object> namedParameters) {

		if (sql == null || sql.isEmpty()) {
			return Collections.emptyList();
		}
		// 拆分order by 或者 group by
		String orderGroupsSql = "";
		if (sql.contains("@")) {
			String[] temp = sql.split("\\@");
			for (int i = 1; i < temp.length; i++) {
				orderGroupsSql += temp[i];
			}
			sql = sql.split("\\@")[0];
		}
		// 筛除多条件下为空的参数
		if (sql.contains("#")) {
			String[] sqls = sql.split("\\#");
			if (sqls.length >= 2) {
				sql = sqls[0];
				Iterator<Entry<String, Object>> entries = namedParameters.entrySet().iterator();
				while (entries.hasNext()) {
					Entry<String, Object> entry = entries.next();
					String key = entry.getKey();
					String value = entry.getValue().toString();
					System.out.println(key + ":" + value);
					if (!"".equals(value)) {
						for (int i = 1; i < sqls.length; i++) {
							if (sqls[i].contains(":" + key)) {
								sql += sqls[i];
							} else {
								continue;
							}

//		        	    	}
						}
					}
				}

			}

		}
		// 组装orderby group by 语句
		sql = sql + "  " + orderGroupsSql;
		if (!sql.contains(";")) {
			return Arrays.asList(sql);
		}

		List<String> statements = new ArrayList<>();
		String[] sqlArray = sql.split(";");
		for (String s : sqlArray) {
			String t = s.trim();
			if (!t.isEmpty()) {
				statements.add(t + ";");
			}
		}
		return statements;
	}
}
