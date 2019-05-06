import axios from 'axios';

const JSON_HEADER = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const fetchDataSources = async () => {
  try {
    const response = await axios.get('/ws/jdbcdatasource');
    return response.data || [];
  } catch (e) {
    return [];
  }
};

const get = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    return [];
  }
} 




