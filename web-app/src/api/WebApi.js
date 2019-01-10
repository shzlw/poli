import axios from 'axios';

const JSON_HEADER = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const fetchDataSources = async () => {
  return await get('/ws/jdbcdatasource');
};

export const fetchDashboardById = async (id) => {
  return await get(`/ws/dashboard/${id}`);
}


const get = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    return [];
  }
} 


