// Add this function to the existing api.ts file
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