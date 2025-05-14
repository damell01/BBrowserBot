// Add these functions to the existing api.ts file

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