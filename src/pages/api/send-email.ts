// import type { APIRoute } from 'astro';

// export const prerender = false

// export const POST: APIRoute = async ({ request }) => {
//   try {
//     const { email } = await request.json();

//     if (!email) {
//       return new Response(JSON.stringify({ error: 'Email is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Get auth token from environment variable (server-side only, secure)
//     const webhook_url = import.meta.env.WEBHOOK_URL;
//     const authToken = import.meta.env.WEBHOOK_AUTH_TOKEN;
    
//     if (!authToken) {
//       console.error('WEBHOOK_AUTH_TOKEN environment variable is not set');
//       return new Response(JSON.stringify({ error: 'Server configuration error' }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Call the n8n webhook
//     const response = await fetch(webhook_url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': authToken,
//       },
//       body: JSON.stringify({ email }),
//     });

//     if (!response.ok) {
//       throw new Error(`Webhook request failed: ${response.status}`);
//     }

//     const data = await response.json();

//     return new Response(JSON.stringify({ 
//       success: true, 
//       message: 'Email sent successfully',
//       data 
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('API error:', error);
//     return new Response(JSON.stringify({ 
//       error: 'Internal server error' 
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// };
