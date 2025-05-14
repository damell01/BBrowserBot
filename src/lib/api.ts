// Add this function to the existing api.ts file
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
    const response = await fetchApi(`${API_URL}/export-leads/${customerId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to export customer leads');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-leads-${customerId}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    throw new Error('Failed to export customer leads');
  }
}