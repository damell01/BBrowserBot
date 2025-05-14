// Add this function to the existing api.ts file
export async function getCustomers() {
  try {
    const response = await fetchApi(`${API_URL}/get_customers.php`, {
      method: 'GET',
      credentials: 'include' // Important for session cookies
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
}

export async function getTrafficStats(params?: {
  page?: string;
  start?: string;
  end?: string;
  sort?: string;
  order?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const response = await fetchApi(`${API_URL}/get_traffic.php`, {
      method: 'GET',
      credentials: 'include' // Important for session cookies
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to fetch traffic stats');
  }
}

export async function exportCustomerLeads(customerId: string) {
  try {
    const response = await fetchApi(`${API_URL}/export_leads.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: customerId }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-leads-${customerId}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to export customer leads');
  }
}