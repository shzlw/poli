package com.shzlw.poli.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shzlw.poli.model.JdbcDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.*;

@Service
public class JdbcQueryService {

    @Autowired
    ObjectMapper mapper;

    public Connection getConnectionByType(JdbcDataSource ds) throws SQLException, ClassNotFoundException {
        return DriverManager.getConnection(ds.getConnectionUrl(), ds.getUsername(), ds.getPassword());
    }

    public String fetchCsvByQuery(JdbcDataSource ds, String sql) {

        try (Connection con = getConnectionByType(ds);
             PreparedStatement ps = con.prepareStatement(sql);) {

            try (ResultSet rs = ps.executeQuery();) {
                StringBuilder table = new StringBuilder();

                ResultSetMetaData metadata = rs.getMetaData();
                int columnCount = metadata.getColumnCount();
                boolean isFirst = true;
                for (int i = 1; i <= columnCount; i++) {
                    String colName = metadata.getColumnName(i);
                    if (isFirst) {
                        table.append(colName);
                        isFirst = false;
                    } else {
                        table.append(",").append(colName);
                    }
                }

                table.append("\n");

                while (rs.next()) {
                    boolean isFirstCol = true;
                    for (int i = 1; i <= columnCount; i++) {
                        if (isFirstCol) {
                            table.append(rs.getString(i));
                            isFirstCol = false;
                        } else {
                            table.append(",").append(rs.getString(i));
                        }
                    }
                    table.append("\n");
                }
                return table.toString();
            }
        } catch (Exception e) {
            return "ERROR: " + e.getClass().getCanonicalName() + ": "+  e.getMessage();
        }
    }

    public String fetchJsonByQuery(JdbcDataSource ds, String sql) {
        try (Connection con = getConnectionByType(ds);
             PreparedStatement ps = con.prepareStatement(sql);) {

            try (ResultSet rs = ps.executeQuery();) {
                ResultSetMetaData metadata = rs.getMetaData();
                int columnCount = metadata.getColumnCount();
                String[] columnNames = new String[columnCount + 1];
                for (int i = 1; i <= columnCount; i++) {
                    String colName = metadata.getColumnName(i);
                    columnNames[i] = colName;
                }

                ObjectMapper mapper = new ObjectMapper();
                ArrayNode array = mapper.createArrayNode();


                while (rs.next()) {
                    ObjectNode node = mapper.createObjectNode();
                    for (int i = 1; i <= columnCount; i++) {
                        node.put(columnNames[i], rs.getString(i));
                    }
                    array.add(node);
                }
                return array.toString();
            }
        } catch (Exception e) {
            return "ERROR: " + e.getClass().getCanonicalName() + ": "+  e.getMessage();
        }
    }
}
