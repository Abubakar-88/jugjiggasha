import axios from 'axios';

const API_BASE_URL = 'https://entitled-minne-abubakar-app-663fb08f.koyeb.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Question API calls
export const questionAPI = {

  // Cache object
  _cache: new Map(),
  
  // Cache duration (5 minutes)
  _cacheDuration: 5 * 60 * 1000,
  
  // Clear expired cache
  _clearExpiredCache() {
    const now = Date.now();
    for (let [key, value] of this._cache.entries()) {
      if (now - value.timestamp > this._cacheDuration) {
        this._cache.delete(key);
      }
    }
  },




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
   getUnansweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
    api.get(`/questions/unanswered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
//   getAnsweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => 
//     api.get(`/questions/answered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),

  getAnsweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
    const cacheKey = `answered_${page}_${size}_${sortBy}_${sortDirection}`;
    
    // Check cache first
    questionAPI._clearExpiredCache();
    const cached = questionAPI._cache.get(cacheKey);
    if (cached) {
      return Promise.resolve(cached.data);
    }
    
    return api.get(`/questions/answered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`)
      .then(response => {
        // Cache the response
        questionAPI._cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
        return response;
      });
  },

  // Clear cache for specific pattern
  clearCache: (pattern = '') => {
    if (pattern) {
      for (let key of questionAPI._cache.keys()) {
        if (key.includes(pattern)) {
          questionAPI._cache.delete(key);
        }
      }
    } else {
      questionAPI._cache.clear();
    }
  }

 
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