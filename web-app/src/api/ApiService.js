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

const httpGet = async (url, parameters = {}) => {
  try {
    const response = await axios.get(url, {params: parameters});
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}

const httpPost = async (url, requestBody = {}) => {
  try {
    const response = await axios.post(url, requestBody);
    return response;
  } catch(error) {
    console.log(error);
    return {};
  }
}
