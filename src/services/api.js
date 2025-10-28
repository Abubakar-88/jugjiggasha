import axios from 'axios';

const API_BASE_URL = 'https://pale-twyla-abubakar-app-c11000c5.koyeb.app/Jugjiggasha/api';

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
  createWithAnswer: (questionData) => api.post('/questions/admin/create', questionData),
  update: (id, questionData) => api.put(`/questions/${id}`, questionData),
  delete: (id) => api.delete(`/questions/${id}`),
  search: (query) => api.get(`/questions/search?q=${query}`),
  getByCategory: (categoryId) => api.get(`/questions/category/${categoryId}`),
  getAnswered: () => api.get('/questions/answered'),
  getUnanswered: () => api.get('/questions/unanswered'),
  answer: (id, answer) => api.post(`/questions/${id}/answer`, { answer }),

 // Paginated methods
  getAllPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
  
  searchPaginated: (query, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/search/paginated?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
  
  getByCategoryPaginated: (categoryId, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/category/${categoryId}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
  
  getAnsweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/answered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
  
  getUnansweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/unanswered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
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