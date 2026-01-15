import apiService from './apiService';

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    sender_username: string;
    receiver_username: string;
    encrypted_content: string;
    iv: string;
    encrypted_aes_key: string;
    algorithm: string;
    timestamp: string;
}

export interface SendMessageData {
    receiver_username: string;
    encrypted_content: string;
    iv: string;
    encrypted_aes_key: string;
    algorithm?: string;
}

class MessageService {
    async sendMessage(data: SendMessageData): Promise<{ message: string; data: Message }> {
        return apiService.post('/api/messages/send', data);
    }

    async getHistory(): Promise<{ messages: Message[] }> {
        return apiService.get('/api/messages/history');
    }

    async getMessage(id: number): Promise<{ message: Message }> {
        return apiService.get(`/api/messages/${id}`);
    }

    async deleteMessage(id: number): Promise<{ message: string }> {
        return apiService.delete(`/api/messages/${id}`);
    }

    async decryptMessage(
        encrypted_content: string,
        iv: string,
        aes_key: string
    ): Promise<{ plaintext: string }> {
        return apiService.post('/api/messages/decrypt', {
            encrypted_content,
            iv,
            aes_key,
        });
    }
}

export const messageService = new MessageService();
export default messageService;
