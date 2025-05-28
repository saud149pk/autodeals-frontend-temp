import { ASK_QUESTION } from '@/app/api/config/API_Endpoints';
import apiPrivate from '@/app/api/config/api_private';

interface ProcessQuestionParams {
  chat_id: string;
  question: string;
}

interface ProcessQuestionResponse {
  answer: string;
}

export const processQuestion = async ({
  chat_id,
  question,
}: ProcessQuestionParams): Promise<ProcessQuestionResponse> => {
  const response = await apiPrivate.post(`${ASK_QUESTION}`, {
    chat_id,
    question,
  });

  return response.data;
};
