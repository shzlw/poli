package com.shzlw.poli.rest;

import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.model.UserAttribute;
import com.shzlw.poli.service.ReportService;
import com.shzlw.poli.util.CommonUtils;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class JdbcQueryWsTest {

    @InjectMocks
    @Spy
    JdbcQueryWs jdbcQueryWs;

    @Mock
    ReportService reportService;

    @Mock
    Component component;

    @Mock
    HttpServletRequest request;

    @Mock
    User user;

    @Mock
    Report report;

    @Test
    public void testIsComponentAccessValid_1() {
        boolean isValid = jdbcQueryWs.isComponentAccessValid(null, request);

        Assert.assertFalse(isValid);
    }

    @Test
    public void testIsComponentAccessValid_2() {
        Mockito.when((User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER)).thenReturn(null);
        boolean isValid = jdbcQueryWs.isComponentAccessValid(component, request);

        Assert.assertFalse(isValid);
    }

    @Test
    public void testIsComponentAccessValid_3() {
        Mockito.when((User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER)).thenReturn(user);
        Mockito.when(reportService.getReportsByUser(user)).thenReturn(Arrays.asList(report));
        Mockito.when(report.getId()).thenReturn(1L);
        Mockito.when(component.getReportId()).thenReturn(1L);

        boolean isValid = jdbcQueryWs.isComponentAccessValid(component, request);

        Assert.assertTrue(isValid);
    }

    @Test
    public void testIsComponentAccessValid_4() {
        Mockito.when((User) request.getAttribute(Constants.HTTP_REQUEST_ATTR_USER)).thenReturn(user);
        Mockito.when(reportService.getReportsByUser(user)).thenReturn(Arrays.asList(report));
        Mockito.when(report.getId()).thenReturn(1L);
        Mockito.when(component.getReportId()).thenReturn(2L);

        boolean isValid = jdbcQueryWs.isComponentAccessValid(component, request);

        Assert.assertFalse(isValid);
    }

    @Test
    public void testAddUserAttributesToFilterParams_1() {
        List<UserAttribute> userAttributes = new ArrayList<>();
        List<FilterParameter> filterParams = new ArrayList<>();

        List<FilterParameter> newFilterParams = jdbcQueryWs.addUserAttributesToFilterParams(userAttributes, filterParams);

        Assert.assertEquals(0, newFilterParams.size());
    }

    @Test
    public void testAddUserAttributesToFilterParams_2() {
        List<UserAttribute> userAttributes = null;
        List<FilterParameter> filterParams = new ArrayList<>();

        List<FilterParameter> newFilterParams = jdbcQueryWs.addUserAttributesToFilterParams(userAttributes, filterParams);

        Assert.assertEquals(0, newFilterParams.size());
    }

    @Test
    public void testAddUserAttributesToFilterParams_3() {
        String attrKey = "key";
        String attrValue = "value";
        List<UserAttribute> userAttributes = new ArrayList<>();
        UserAttribute attr1 = new UserAttribute();
        attr1.setAttrKey(attrKey);
        attr1.setAttrValue(attrValue);
        userAttributes.add(attr1);

        List<FilterParameter> filterParams = new ArrayList<>();
        String param = "param2";
        String value = "value2";
        FilterParameter f1 = new FilterParameter();
        f1.setParam(param);
        f1.setValue(value);
        f1.setType(Constants.FILTER_TYPE_SINGLE);
        filterParams.add(f1);

        List<FilterParameter> newFilterParams = jdbcQueryWs.addUserAttributesToFilterParams(userAttributes, filterParams);

        Assert.assertEquals(2, newFilterParams.size());
        Assert.assertEquals(Constants.FILTER_TYPE_USER_ATTRIBUTE, newFilterParams.get(0).getType());
        Assert.assertEquals(CommonUtils.getParamByAttrKey(attrKey), newFilterParams.get(0).getParam());
        Assert.assertEquals(attrValue, newFilterParams.get(0).getValue());

        Assert.assertEquals(Constants.FILTER_TYPE_SINGLE, newFilterParams.get(1).getType());
        Assert.assertEquals(param, newFilterParams.get(1).getParam());
        Assert.assertEquals(value, newFilterParams.get(1).getValue());
    }
}
