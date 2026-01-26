import api from '../api/axios';

const reactionService = {
  likeItem: async (itemId) => {
    const response = await api.post(`/reactions/item/${itemId}/like`);
    return response.data;
  },

  addComment: async (itemId, text) => {
    const response = await api.post(`/reactions/item/${itemId}/comment`, { text });
    return response.data;
  },

  deleteComment: async (itemId, commentId) => {
    const response = await api.delete(`/reactions/item/${itemId}/comment/${commentId}`);
    return response.data;
  },
};

export default reactionService;
