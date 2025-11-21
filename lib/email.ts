interface CateringOrderData {
  storeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cateringDate: string;
  pickupTime: string;
}

export async function sendCateringOrderEmail(
  storeEmail: string,
  orderData: CateringOrderData
): Promise<void> {
  try {
    const response = await fetch('/api/send-catering-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeEmail,
        orderData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Email sending failed');
    }

    console.log(`Catering order email sent to ${storeEmail}`);
  } catch (error) {
    console.error('Failed to send catering order email:', error);
    throw error;
  }
}