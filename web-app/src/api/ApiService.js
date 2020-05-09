import axios from 'axios';

export const fetchJdbcdatasources = async () => {
  return await httpGet('/ws/jdbcdatasources');
}

export const fetchDatabaseSchema = async (jdbcDataSourceId) => {
  return await httpGet(`/ws/jdbcdatasources/schema/${jdbcDataSourceId}`);
}

export const runQuery = async (jdbcDataSourceId, sqlQuery, resultLimit = 100) => {
  const requestBody = {
    jdbcDataSourceId: jdbcDataSourceId,
    sqlQuery: sqlQuery,
    resultLimit: resultLimit
  };
  return await httpPost('/ws/jdbcquery/query', requestBody);
}

export const fetchAuditLogs = async (page, pageSize, searchValue) => {
  const parameters = {
    search: searchValue,
    page,
    size: pageSize
  };

  return await httpGet('/ws/audit-logs', parameters);
}

export const fetchSavedQueries = async (page, pageSize, searchValue) => {
  const parameters = {
    search: searchValue,
    page,
    size: pageSize
  };

  return await httpGet('/ws/saved-queries', parameters);
}


export const httpGet = async (url, parameters = {}) => {
  try {
    const response = await axios.get(url, {params: parameters});
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}

export const httpPost = async (url, requestBody = {}) => {
  try {
    const response = await axios.post(url, requestBody);
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}

export const httpPut = async (url, requestBody = {}) => {
  try {
    const response = await axios.put(url, requestBody);
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}

export const httpDelete = async (url, parameters = {}) => {
  try {
    const response = await axios.delete(url, {params: parameters});
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}

