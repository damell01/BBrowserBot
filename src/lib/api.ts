import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse {
  success: boolean;
  error?: string;
  pixelInstalled?: boolean;
  [key: string]: any;
}

async function handleResponse(response: Response): Promise<ApiResponse> {
  let responseData: any;
  
  try {
    const text = await response.text();
    
    if (!text.trim()) {
      return {
        success: false,
        error: 'Server is not responding properly. Please try again later.'
      };
    }

    try {
      responseData = JSON.parse(text);
    } catch (e) {
      return {
        success: false,
        error: 'Server returned an invalid response. Please try again later.'
      };
    }
  } catch (e) {
    return {
      success: false,
      error: 'Failed to read server response. Please try again later.'
    };
  }

  if (responseData.success === undefined) {
    responseData.success = response.ok;
  }

  if (response.ok && !responseData.user && typeof responseData === 'object') {
    if (Array.isArray(responseData)) {
      return { success: true, leads: responseData };
    }
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

const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorData);
      } catch (e) {
        parsedError = { error: errorData || response.statusText };
      }

      throw new Error(
        parsedError.error || 
        `Server returned ${response.status}: ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the server. Please check your connection and try again.'
      );
    }
    throw error;
  }
};

export async function login(email: string, password: string) {
  try {
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
    toast.error('Failed to logout');
    throw error;
  }
}

export async function getLeads() {
  try {
    const response = await fetchApi(`${API_URL}/get_leads.php`, {
      method: 'GET',
    });

    const data = await handleResponse(response);

    if (data.success && !data.leads && Array.isArray(data)) {
      return { success: true, leads: data };
    }

    return data;
  } catch (error) {
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

    const data = await handleResponse(response);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update lead status');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update lead status';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getStats() {
  try {
    const response = await fetchApi(`${API_URL}/get_stats.php`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch stats');
  }
}

export async function getPixelScript() {
  try {
    const response = await fetchApi(`${API_URL}/pixel.js`, {
      method: 'POST',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch pixel script');
  }
}

export async function verifyPixel(url: string, customer_id: string) {
  try {
    const response = await fetchApi(`${API_URL}/verify_pixel.php`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        customer_id,
      }),
    });

    const data = await handleResponse(response);
    
    // Handle the specific response format
    if (data.success && data.pixel_installed === 'already_installed') {
      return { success: true, pixelInstalled: true };
    }

    return data;
  } catch (error) {
    throw new Error('Failed to verify pixel');
  }
}

export async function grantAdminAccess(userId: string) {
  try {
    const response = await fetchApi(`${API_URL}/admin/grant_access.php`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    const data = await handleResponse(response);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to grant admin access');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to grant admin access';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function revokeAdminAccess(userId: string) {
  try {
    const response = await fetchApi(`${API_URL}/admin/revoke_access.php`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    const data = await handleResponse(response);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to revoke admin access');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to revoke admin access';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}