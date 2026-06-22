import api from './api';

export const reviewService = {
  // CREATE REVIEW
  async reviewCode(code, language) {
    const res = await api.post('/reviews/analyze', {
      code,
      language,
    });

    // backend: { success, data }
    return res.data.data;
  },

  // GET HISTORY
  async getHistory({ page = 1, limit = 10 } = {}) {
  const res = await api.get(`/reviews?page=${page}&limit=${limit}`);

  return {
    reviews: res.data?.data || [],
    hasMore: res.data?.hasMore || false,
  };
},

  // GET SINGLE REVIEW
  async getReviewById(id) {
    const res = await api.get(`/reviews/${id}`);
    return res.data.data;
  },

  // DELETE REVIEW
  async deleteReview(id) {
    await api.delete(`/reviews/${id}`);
  },
};