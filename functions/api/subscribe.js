// Newsletter subscription handler
// POST /api/subscribe — adds email to Buttondown

const BUTTONDOWN_API_KEY = 'd5fd4665-2909-400f-a44b-0441d63ff797';

export async function onRequest(context) {
  const request = context.request;

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    let email;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
    } else if (contentType.includes('form')) {
      const formData = await request.formData();
      email = formData.get('email');
    } else {
      const body = await request.json().catch(() => null);
      email = body?.email;
    }

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Subscribe to Buttondown (v1 API uses email_address)
    const res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        tags: ['website'],
      }),
    });

    const data = await res.json();

    if (res.ok || res.status === 201) {
      return new Response(JSON.stringify({ success: true, message: 'Subscribed! Check your email to confirm.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } else if (data.code === 'email_already_exists' || (data.detail && data.detail.includes('already'))) {
      return new Response(JSON.stringify({ success: true, message: 'You\'re already subscribed!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: data.detail || 'Subscription failed. Please try again.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
