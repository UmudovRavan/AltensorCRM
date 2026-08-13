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
  register: (registerData) => request('/Auth/register', 'POST', registerData),
  changePassword: (dto) => request('/Auth/change-password', 'POST', dto),
  logout: async () => {
    try {
      await request('/Auth/logout', 'POST');
    } catch {}
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
  convertToDeal: (id, payload = { dealAmount: 0, assignedUserId: null }) => request(`/Leads/${id}/convert-to-deal`, 'POST', payload)
};

export const dealsApi = {
  getAll: () => request('/Deals'),
  getById: (id) => request(`/Deals/${id}`),
  create: (data) => request('/Deals', 'POST', data),
  update: (id, data) => request(`/Deals/${id}`, 'PUT', data),
  updateStage: (id, stage, lostReason = '') => request(`/Deals/${id}/stage?newStatus=${stage}${lostReason ? `&lostReason=${encodeURIComponent(lostReason)}` : ''}`, 'PATCH'),
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
  delete: (id) => request(`/Organizations/${id}`, 'DELETE'),
  getContacts: (id) => request(`/Organizations/${id}/contacts`),
  getDeals: (id) => request(`/Organizations/${id}/deals`)
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
  getMe: () => request('/Users/me'),
  getById: (id) => request(`/Users/${id}`),
  updateProfile: (id, data) => request(`/Users/${id}/profile`, 'PUT', data),
  uploadAvatar: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/Users/${id}/avatar`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload avatar image');
    return await response.json();
  },
  invite: (emailsOrDto, role) => {
    const payload = typeof emailsOrDto === 'object' ? emailsOrDto : { emails: emailsOrDto, role };
    return request('/Users/invite', 'POST', payload);
  },
  updateRole: (id, roleOrDto) => {
    const payload = typeof roleOrDto === 'object' ? roleOrDto : { role: roleOrDto };
    return request(`/Users/${id}/role`, 'PUT', payload);
  },
  delete: (id) => request(`/Users/${id}`, 'DELETE'),
  getSalesHierarchy: () => request('/Users/sales-hierarchy')
};

export const productsApi = {
  getAll: () => request('/Products'),
  getById: (id) => request(`/Products/${id}`),
  create: (data) => request('/Products', 'POST', data),
  update: (id, data) => request(`/Products/${id}`, 'PUT', data),
  delete: (id) => request(`/Products/${id}`, 'DELETE'),
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/Products/upload-image`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return await response.json();
  }
};

export const dealProductsApi = {
  getByDealId: (dealId) => request(`/DealProducts/deal/${dealId}`),
  add: (data) => request('/DealProducts', 'POST', data),
  delete: (id) => request(`/DealProducts/${id}`, 'DELETE')
};

export const dashboardApi = {
  getStats: () => request('/Dashboard/stats')
};

export const emailTemplatesApi = {
  getAll: () => request('/EmailTemplates'),
  getById: (id) => request(`/EmailTemplates/${id}`),
  create: (data) => request('/EmailTemplates', 'POST', data),
  update: (id, data) => request(`/EmailTemplates/${id}`, 'PUT', data),
  toggleEnabled: (id) => request(`/EmailTemplates/${id}/toggle`, 'PATCH'),
  delete: (id) => request(`/EmailTemplates/${id}`, 'DELETE')
};

export const emailsApi = {
  send: (dto) => request('/Emails/send', 'POST', dto),
  getByLeadId: (leadId) => request(`/Emails/lead/${leadId}`),
  getByDealId: (dealId) => request(`/Emails/deal/${dealId}`)
};

const TASK_MGMT_API_URL = 'http://localhost:5243/api';

async function taskRequest(endpoint, method = 'GET', body = null) {
  const token = getAuthToken() || localStorage.getItem('authToken');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${TASK_MGMT_API_URL}${endpoint}`, config);

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

export const taskManagementApi = {
  getAllTasks: () => taskRequest('/Task/GetAllTask'),
  getAllUsers: () => taskRequest('/Authorize/AllUsers'),
  getTaskById: (id) => taskRequest(`/Task/GetTask/${id}`),
  createTask: (data) => {
    const formData = new FormData();
    formData.append('Title', data.title);
    formData.append('Description', data.description || '');
    formData.append('Difficulty', String(data.difficulty ?? 0));
    formData.append('Status', String(data.status ?? 0));
    if (data.deadline) formData.append('Deadline', data.deadline);
    if (data.createdByUserId) formData.append('CreatedByUserId', data.createdByUserId);
    if (data.assignedToUserId) formData.append('AssignedToUserId', data.assignedToUserId);
    return taskRequest('/Task/CreateTask', 'POST', formData);
  },
  updateTask: (data) => taskRequest('/Task/UpdateTask', 'PUT', data),
  deleteTask: (id) => taskRequest(`/Task/DeleteTask/${id}`, 'DELETE'),
  assignTask: (taskId, userId) => taskRequest(`/Task/AssignTask?taskId=${taskId}&userId=${userId}`, 'POST'),
  addComment: (taskId, comment) => taskRequest(`/Task/AddComment?taskId=${taskId}&comment=${encodeURIComponent(comment)}`, 'POST'),
  getNotifications: () => taskRequest('/Notifications'),
  markNotificationRead: (id) => taskRequest(`/Notifications/${id}/read`, 'POST')
};
