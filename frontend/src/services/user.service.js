import api from '../api/axios';

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, statusData) => {
    const response = await api.patch(`/users/${id}/status`, statusData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  }
};

export default userService;
