package com.shzlw.poli.dao;

import org.junit.Assert;
import org.junit.Test;

public class DaoHelperTest {

    @Test
    public void testToOffset() {
        Assert.assertEquals(0, DaoHelper.toOffset(1, 10));
        Assert.assertEquals(DaoHelper.DEFAULT_OFFSET, DaoHelper.toOffset(0, 10));
        Assert.assertEquals(DaoHelper.DEFAULT_OFFSET, DaoHelper.toOffset(1, 0));
        Assert.assertEquals(90, DaoHelper.toOffset(10, 10));
    }

    @Test
    public void testToLimit() {
        Assert.assertEquals(10, DaoHelper.toLimit(10));
        Assert.assertEquals(DaoHelper.DEFAULT_LIMIT, DaoHelper.toLimit(0));
        Assert.assertEquals(DaoHelper.DEFAULT_LIMIT, DaoHelper.toLimit(-1));
    }
}
