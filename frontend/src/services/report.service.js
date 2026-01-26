import api from '../api/axios';

const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.patch(`/reports/${id}`, reportData);
    return response.data;
  }
};

export default reportService;
