import axios from 'axios';

interface OriginateChannelResponse {
  message: string;
  channelId: string;
}

interface OriginateChannelParams {
  chatId: string;
}

class AsteriskAPI {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Originate a new channel.
   * @param endpoint - The endpoint to originate the channel (e.g., 'PJSIP/7000').
   * @param params - Additional parameters for the channel.
   * @returns A promise that resolves with the channel ID.
   */
  async originateChannel(endpoint: string, data: { chatId: string }) {
    try {
        const response = await axios.post(`${this.apiUrl}/originate`, { endpoint, ...data });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to originate channel.');
    }
}
}

 

export default AsteriskAPI;