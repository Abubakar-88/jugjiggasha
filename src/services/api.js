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

  _cache: new Map(),
  _cacheTimeout: 2 * 60 * 1000, // 2 minutes cache
  
  _clearExpiredCache: () => {
    const now = Date.now();
    for (const [key, value] of questionAPI._cache.entries()) {
      if (now - value.timestamp > questionAPI._cacheTimeout) {
        questionAPI._cache.delete(key);
      }
    }
  },

  _getFromCache: (key) => {
    questionAPI._clearExpiredCache();
    const cached = questionAPI._cache.get(key);
    if (cached) {
      console.log('📦 Cache hit:', key);
      return cached.data;
    }
    return null;
  },

  _setToCache: (key, data) => {
    questionAPI._cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
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

  // getAnsweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
  //   const cacheKey = `answered_${page}_${size}_${sortBy}_${sortDirection}`;
    
  //   // Check cache first
  //   questionAPI._clearExpiredCache();
  //   const cached = questionAPI._cache.get(cacheKey);
  //   if (cached) {
  //     return Promise.resolve(cached.data);
  //   }
    
  //   return api.get(`/questions/answered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`)
  //     .then(response => {
  //       // Cache the response
  //       questionAPI._cache.set(cacheKey, {
  //         data: response,
  //         timestamp: Date.now()
  //       });
  //       return response;
  //     });
  // },
 getAnsweredPaginated: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
    const cacheKey = `answered_${page}_${size}_${sortBy}_${sortDirection}`;
    
    // Check cache first
    const cached = questionAPI._getFromCache(cacheKey);
    if (cached) {
      return Promise.resolve(cached);
    }
    
    console.log('🚀 API call:', cacheKey);
    return api.get(`/questions/answered/paginated`, {
      params: { 
        page, 
        size, 
        sortBy, 
        sortDirection,
        // Add fields filtering to reduce payload
        fields: 'id,title,description,answer,createdAt,answeredAt,category,isAnswered'
      }
    })
      .then(response => {
        // Cache the response
        questionAPI._setToCache(cacheKey, response);
        return response;
      })
      .catch(error => {
        console.error('API Error:', error);
        throw error;
      });
  },

  // Preload multiple pages
  preloadPages: async (startPage, endPage, size = 10) => {
    const preloadPromises = [];
    for (let page = startPage; page <= endPage; page++) {
      preloadPromises.push(
        questionAPI.getAnsweredPaginated(page, size, 'createdAt', 'desc')
          .catch(err => {
            console.log(`Preload page ${page} failed:`, err.message);
            return null;
          })
      );
    }
    
    return Promise.allSettled(preloadPromises);
  },

  // Clear specific cache
  clearCache: (pattern = null) => {
    if (pattern) {
      for (const [key] of questionAPI._cache.entries()) {
        if (key.includes(pattern)) {
          questionAPI._cache.delete(key);
        }
      }
    } else {
      questionAPI._cache.clear();
    }
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