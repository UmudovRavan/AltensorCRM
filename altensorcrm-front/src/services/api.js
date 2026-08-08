const API_BASE_URL = 'https://localhost:7114/api';

export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

async function request(endpoint, method = 'GET', body = null) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Xəta baş verdi';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorText;
    } catch {
      errorMessage = errorText || `Xəta kodu: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

export const authApi = {
  login: async (username, password) => {
    const data = await request('/Auth/login', 'POST', { username, password });
    if (data && data.token) {
      setAuthToken(data.token);
      setCurrentUser(data);
    }
    return data;
  },
  logout: () => {
    setAuthToken(null);
    setCurrentUser(null);
  }
};

export const leadsApi = {
  getAll: () => request('/Leads'),
  getById: (id) => request(`/Leads/${id}`),
  create: (data) => request('/Leads', 'POST', data),
  update: (id, data) => request(`/Leads/${id}`, 'PUT', data),
  delete: (id) => request(`/Leads/${id}`, 'DELETE'),
  convertToDeal: (id) => request(`/Leads/${id}/convert-to-deal`, 'POST')
};

export const dealsApi = {
  getAll: () => request('/Deals'),
  getById: (id) => request(`/Deals/${id}`),
  create: (data) => request('/Deals', 'POST', data),
  update: (id, data) => request(`/Deals/${id}`, 'PUT', data),
  updateStage: (id, stage) => request(`/Deals/${id}/stage`, 'PATCH', { stage }),
  delete: (id) => request(`/Deals/${id}`, 'DELETE')
};

export const contactsApi = {
  getAll: () => request('/Contacts'),
  getLookup: () => request('/Contacts/lookup'),
  getById: (id) => request(`/Contacts/${id}`),
  create: (data) => request('/Contacts', 'POST', data),
  update: (id, data) => request(`/Contacts/${id}`, 'PUT', data),
  delete: (id) => request(`/Contacts/${id}`, 'DELETE')
};

export const orgsApi = {
  getAll: () => request('/Organizations'),
  getLookup: () => request('/Organizations/lookup'),
  getById: (id) => request(`/Organizations/${id}`),
  create: (data) => request('/Organizations', 'POST', data),
  update: (id, data) => request(`/Organizations/${id}`, 'PUT', data),
  delete: (id) => request(`/Organizations/${id}`, 'DELETE')
};

export const notesApi = {
  getAll: () => request('/Notes'),
  getById: (id) => request(`/Notes/${id}`),
  create: (data) => request('/Notes', 'POST', data),
  update: (id, data) => request(`/Notes/${id}`, 'PUT', data),
  delete: (id) => request(`/Notes/${id}`, 'DELETE')
};

export const callLogsApi = {
  getAll: () => request('/CallLogs'),
  getById: (id) => request(`/CallLogs/${id}`),
  create: (data) => request('/CallLogs', 'POST', data),
  delete: (id) => request(`/CallLogs/${id}`, 'DELETE')
};

export const usersApi = {
  getAll: () => request('/Users'),
  invite: (emails, role) => request('/Users/invite', 'POST', { emails, role }),
  updateRole: (id, role) => request(`/Users/${id}/role`, 'PUT', { role }),
  getSalesHierarchy: () => request('/Users/sales-hierarchy')
};
