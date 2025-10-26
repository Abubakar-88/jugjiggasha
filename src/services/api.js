import axios from 'axios';

const API_BASE_URL = 'http://localhost/Jugjiggasha/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Question API calls
export const questionAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  create: (questionData) => api.post('/questions', questionData),
  update: (id, questionData) => api.put(`/questions/${id}`, questionData),
  delete: (id) => api.delete(`/questions/${id}`),
  search: (query) => api.get(`/questions/search?q=${query}`),
  getByCategory: (categoryId) => api.get(`/questions/category/${categoryId}`),
  getAnswered: () => api.get('/questions/answered'),
  getUnanswered: () => api.get('/questions/unanswered'),
  answer: (id, answer) => api.post(`/questions/${id}/answer`, { answer }),
};

// Category API calls
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;