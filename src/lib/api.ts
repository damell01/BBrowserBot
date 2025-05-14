const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
}

export async function login(email: string, password: string) {
  try {
    const response = await fetchApi(`${API_URL}/auth/login.php`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Login failed');
  }
}

export async function register(email: string, password: string, name: string, companyName: string) {
  try {
    const response = await fetchApi(`${API_URL}/auth/register.php`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name, companyName }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export async function logout() {
  try {
    const response = await fetchApi(`${API_URL}/auth/logout.php`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Logout failed');
  }
}

// Add this function to the existing api.ts file
export async function getCustomers() {
  try {
    const response = await fetchApi(`${API_URL}/customers.php`, {
      method: 'GET',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
}

export async function getWebsiteHits(params?: {
  page?: string;
  start?: string;
  end?: string;
  sort?: 'hits' | 'page';
  order?: 'asc' | 'desc';
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page);
    if (params?.start) queryParams.append('start', params.start);
    if (params?.end) queryParams.append('end', params.end);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const response = await fetchApi(`${API_URL}/hits.php?${queryParams.toString()}`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch website hits');
  }
}

export async function exportCustomerLeads(customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/export-customer-leads.php?customer_id=${customerId}`, {
      method: 'GET',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to export customer leads');
  }
}

export async function verifyPixel(websiteUrl: string, customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/verify-pixel.php`, {
      method: 'POST',
      body: JSON.stringify({ websiteUrl, customerId }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to verify pixel installation');
  }
}

export async function redirectToCustomerPortal() {
  try {
    const response = await fetchApi(`${API_URL}/create-portal-session.php`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to create customer portal session');
  }
}