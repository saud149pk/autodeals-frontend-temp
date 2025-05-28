import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const apiPrivate = axios.create({
  baseURL: apiUrl || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiPrivate.interceptors.request.use((config) => {
  const localUserD = localStorage.getItem('user');
  if (localUserD) {
    const userD = JSON.parse(localUserD as string);
    config.headers.Authorization = `Bearer ${userD.access_token}`;
  }
  return config;
});

export default apiPrivate;
