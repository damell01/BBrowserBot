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