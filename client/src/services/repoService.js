import api from './api';

export const repoService = {
  async getRepoHistory() {
    const res = await api.get('/repo');
    return res.data.data || [];
  },

  async getRepoReviewById(id) {
    const res = await api.get(`/repo/${id}`);
    return res.data.data;
  },

  async deleteRepoReview(id) {
    const res = await api.delete(`/repo/${id}`);
    return res.data;
  },
};