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