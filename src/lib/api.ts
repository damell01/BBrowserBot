import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse {
  success: boolean;
  error?: string;
  [key: string]: any;
}

async function handleResponse(response: Response): Promise<ApiResponse> {
  let responseData: any;
  
  try {
    const text = await response.text();
    
    // Handle empty responses
    if (!text.trim()) {
      console.error('Empty response received from server');
      return {
        success: false,
        error: 'Server is not responding properly. Please try again later.'
      };
    }

    try {
      // Attempt to parse as JSON regardless of content type
      responseData = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response:', text);
      // If the response is HTML or other format, create a standardized error response
      return {
        success: false,
        error: 'Server returned an invalid response. Please try again later.'
      };
    }
  } catch (e) {
    console.error('Response reading error:', e);
    return {
      success: false,
      error: 'Failed to read server response. Please try again later.'
    };
  }

  // Log response for debugging
  console.log('API Response:', {
    status: response.status,
    statusText: response.statusText,
    data: responseData
  });

  // If the response doesn't have a success property, try to infer it from the status code
  if (responseData.success === undefined) {
    responseData.success = response.ok;
  }

  // If we have a successful status code but no user data, try to normalize the response
  if (response.ok && !responseData.user && typeof responseData === 'object') {
    // Check if the response is a leads array
    if (Array.isArray(responseData)) {
      return {
        success: true,
        leads: responseData
      };
    }
    // Otherwise assume the entire response object might be the user data
    responseData = {
      success: true,
      user: responseData
    };
  }

  return responseData;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Basic fetch wrapper with default options
const fetchApi = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Add credentials: 'include' to send cookies
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });
};

export async function login(email: string, password: string) {
  try {
    console.log('Login attempt:', { email, apiUrl: API_URL });
    
    const response = await fetchApi(`${API_URL}/auth.php`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(
  email: string, 
  password: string, 
  name: string, 
  companyName: string
) {
  try {
    const response = await fetchApi(`${API_URL}/auth.php`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        name,
        companyName,
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetchApi(`${API_URL}/auth.php`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'logout',
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Failed to logout');
    throw error;
  }
}

export async function getLeads() {
  try {
    console.log('Fetching leads...');
    const response = await fetchApi(`${API_URL}/get_leads.php`, {
      method: 'GET',
    });

    const data = await handleResponse(response);
    console.log('Leads response:', data);

    // If the response is successful but leads is not in the expected format,
    // try to normalize it
    if (data.success && !data.leads && Array.isArray(data)) {
      return { success: true, leads: data };
    }

    return data;
  } catch (error) {
    console.error('Get leads error:', error);
    throw new Error('Failed to fetch leads');
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const response = await fetchApi(`${API_URL}/update_lead.php`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        status,
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Update lead status error:', error);
    throw new Error('Failed to update lead status');
  }
}

export async function getStats() {
  try {
    const response = await fetchApi(`${API_URL}/get_stats.php`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Get stats error:', error);
    throw new Error('Failed to fetch stats');
  }
}

export async function getPixelScript() {
  try {
    const response = await fetchApi(`${API_URL}/pixel.js`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Get pixel script error:', error);
    throw new Error('Failed to fetch pixel script');
  }
}

export async function verifyPixel(url: string, trackingId: string) {
  try {
    const response = await fetchApi(`${API_URL}/verify_pixel.php`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        trackingId,
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Verify pixel error:', error);
    throw new Error('Failed to verify pixel');
  }
}