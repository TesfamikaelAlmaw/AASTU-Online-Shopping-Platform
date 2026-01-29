import api from "../api/axios";
import authService from "./auth.service";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000/chat";

let socketInstance = null;

const chatService = {
  getChats: async () => {
    const response = await api.get("/chats");
    return response.data;
  },

  createChat: async (participantId) => {
    const response = await api.post("/chats", { participantId });
    return response.data;
  },

  getMessages: async (chatId, params = {}) => {
    const response = await api.get(`/chats/${chatId}/messages`, { params });
    return response.data;
  },

  sendMessage: async (chatId, payload) => {
    const response = await api.post(`/chats/${chatId}/messages`, payload);
    return response.data;
  },

  markRead: async (chatId, messageIds) => {
    const response = await api.post(`/chats/${chatId}/read`, { messageIds });
    return response.data;
  },

  addReaction: async (messageId, emoji) => {
    const response = await api.post(`/chats/messages/${messageId}/reaction`, {
      emoji,
    });
    return response.data;
  },

  deleteMessage: async (messageId, scope) => {
    const response = await api.post(`/chats/messages/${messageId}/delete`, {
      scope,
    });
    return response.data;
  },

  toggleFavorite: async (chatId, isFavorite) => {
    const response = await api.post(`/chats/${chatId}/favorite`, {
      isFavorite,
    });
    return response.data;
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/chats/attachments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getSharedMedia: async (chatId) => {
    const response = await api.get(`/chats/${chatId}/shared`);
    return response.data;
  },

  connectSocket: () => {
    if (socketInstance) return socketInstance;
    const token = authService.getToken();
    socketInstance = io(SOCKET_URL, {
      auth: { token },
    });
    return socketInstance;
  },

  disconnectSocket: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },
};

export default chatService;
