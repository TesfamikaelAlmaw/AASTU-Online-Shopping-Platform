import api from '../api/axios';

const itemService = {
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  getAllItems: async () => {
    const response = await api.get('/items');
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  updateItem: async (id, itemData) => {
    const response = await api.patch(`/items/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  likeItem: async (id) => {
    const response = await api.post(`/items/${id}/like`);
    return response.data;
  },

  addComment: async (id, text) => {
    const response = await api.post(`/items/${id}/comment`, { text });
    return response.data;
  },

  deleteComment: async (itemId, commentId) => {
    const response = await api.delete(`/items/${itemId}/comment/${commentId}`);
    return response.data;
  }
};

export default itemService;
