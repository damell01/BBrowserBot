// Add these functions to the existing api.ts file

const API_URL = import.meta.env.VITE_API_URL;

async function fetchApi(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

async function handleResponse(response: Response) {
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse JSON response');
  }
}

export async function getBillingTiers() {
  try {
    const response = await fetchApi(`${API_URL}/billing/tiers.php`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch billing tiers');
  }
}

export async function updateSubscription(tierId: string) {
  try {
    const response = await fetchApi(`${API_URL}/billing/update_subscription.php`, {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to update subscription');
  }
}

export async function getCurrentUsage() {
  try {
    const response = await fetchApi(`${API_URL}/billing/usage.php`, {
      method: 'GET',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch current usage');
  }
}

export async function exportCustomerLeads(customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/customers/${customerId}/export`, {
      method: 'POST',
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to export customer leads');
  }
}

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

export async function verifyPixel(websiteUrl: string, customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/verify_pixel.php`, {
      method: 'POST',
      body: JSON.stringify({ url: websiteUrl, customer_id: customerId }),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to verify pixel');
  }
}