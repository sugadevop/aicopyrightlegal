// Redirect /styles.css to the hashed Astro CSS file
export async function onRequest(context) {
  // Fetch the homepage and extract the CSS link
  const homeRes = await context.env.ASSETS.fetch(new URL('/', context.request.url));
  const html = await homeRes.text();
  const match = html.match(/href="\/(\_astro\/[^"]+\.css)"/);
  
  if (match) {
    // Serve the actual CSS file
    return context.env.ASSETS.fetch(new URL(`/${match[1]}`, context.request.url));
  }
  
  return new Response('', { status: 404 });
}
