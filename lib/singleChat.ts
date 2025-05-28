import { GET_CHAT_BY_ID } from '@/app/api/config/API_Endpoints';
import apiPrivate from '@/app/api/config/api_private';

export const fetchSingleChat = async (chat_id: string) => {
  const res = await apiPrivate.get(`${GET_CHAT_BY_ID}?chat_id=${chat_id}`);
  return res.data;
};
