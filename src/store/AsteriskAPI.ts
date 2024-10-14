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
  async originateChannel(endpoint: string, params: OriginateChannelParams): Promise<OriginateChannelResponse> {
    try {
      const response = await axios.post<OriginateChannelResponse>(
        `${this.apiUrl}/api/asterisk/originate`,
        { endpoint, ...params },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to originate channel:', error);
      throw error.response?.data || { error: 'Unknown error occurred' };
    }
  }
}

 

export default AsteriskAPI;