// Add these functions to the existing api.ts file

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

async function fetchApi(url: string, options: RequestInit = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, { ...defaultOptions, ...options });
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
      body: JSON.stringify({ email, password, name, company_name: companyName }),
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

export async function getCustomers() {
  try {
    const response = await fetchApi(`${API_URL}/get_customers.php`, {
      method: 'GET',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
}

export async function exportCustomerLeads(customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/export_customer_leads.php`, {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to export customer leads');
  }
}

export async function getUsers() {
  try {
    const response = await fetchApi(`${API_URL}/get_users.php`, {
      method: 'GET',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  company_name: string;
  role: string;
}) {
  try {
    const response = await fetchApi(`${API_URL}/create_user.php`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

export async function updateUser(userId: string, userData: {
  name?: string;
  email?: string;
  company_name?: string;
  role?: string;
}) {
  try {
    const response = await fetchApi(`${API_URL}/update_user.php`, {
      method: 'POST',
      body: JSON.stringify({ id: userId, ...userData }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to update user');
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await fetchApi(`${API_URL}/delete_user.php`, {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

export async function verifyPixel(websiteUrl: string, customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/scan-pixel`, {
      method: 'POST',
      body: JSON.stringify({ 
        website_url: websiteUrl,
        customer_id: customerId 
      }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to verify pixel installation');
  }
}

export async function redirectToCustomerPortal() {
  try {
    const response = await fetchApi(`${API_URL}/create_portal_session.php`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to create customer portal session');
  }
}