type CateringOrderEmailPayload = {
  to: string;
  storeName: string;
  cateringDate: string;
  pickupTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const SENDER_EMAIL = 'catering-orders@hotlob.com.au';

function buildCateringOrderEmailHtml(payload: CateringOrderEmailPayload) {
  const {
    storeName,
    cateringDate,
    pickupTime,
    firstName,
    lastName,
    email,
    phone,
    submittedAt,
  } = payload;

  return `
    <div style="font-family: Arial, sans-serif; color: #1d1e1f;">
      <h2 style="margin: 0 0 12px;">New Catering Order</h2>
      <p style="margin: 0 0 16px;">
        A new catering order has been submitted. Please contact the customer to confirm and prepare the order.
      </p>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Store</td>
          <td style="padding: 6px 0;">${storeName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Pickup date</td>
          <td style="padding: 6px 0;">${cateringDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Pickup time</td>
          <td style="padding: 6px 0;">${pickupTime}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Customer name</td>
          <td style="padding: 6px 0;">${firstName} ${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Customer email</td>
          <td style="padding: 6px 0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Customer phone</td>
          <td style="padding: 6px 0;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Order submitted at</td>
          <td style="padding: 6px 0;">${submittedAt}</td>
        </tr>
      </table>
      <p style="margin: 0;">Please contact the customer if you need any clarification.</p>
    </div>
  `.trim();
}

export async function sendCateringOrderEmail(payload: CateringOrderEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const subject = `New Catering Order - ${payload.storeName} - ${payload.cateringDate} ${payload.pickupTime}`;
  const html = buildCateringOrderEmailHtml(payload);

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER_EMAIL,
      to: payload.to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${message}`);
  }
}
