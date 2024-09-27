import axios from 'axios';

export const sendWebhook = async (url: string, data: any) => {
  try {
    await axios.post(url, data);
  } catch (error) {
    console.error('Webhook delivery failed:', error);
  }
};