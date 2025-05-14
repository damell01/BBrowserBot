// Add these functions to the existing api.ts file

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