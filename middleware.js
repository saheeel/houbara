export const config = {
  matcher: ['/'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const guest = url.searchParams.get('to');

  // If there's no personalized 'to' parameter, we don't need to intercept
  if (!guest) {
    return; 
  }

  // Fetch the actual static index.html
  // We use '/index.html' so it doesn't match the '/' matcher and avoids infinite loops
  const indexUrl = new URL('/index.html', request.url);
  const response = await fetch(indexUrl);
  
  if (!response.ok) {
    return;
  }
  
  let html = await response.text();

  try {
    let decodedName = guest;
    try {
      decodedName = decodeURIComponent(guest);
    } catch(e) {}
    
    // Replace underscores with spaces (as defined in EditPage logic)
    decodedName = decodedName.replace(/_/g, ' ');

    const newTitle = `دعوة خاصة إلى السيد / ${decodedName} | استدامة الحبارى`;
    
    // Inject the personalized name into the HTML <title> and OG tags
    html = html.replace(
      '<title>دعوة | استدامة الحبارى</title>', 
      `<title>${newTitle}</title>`
    );
    html = html.replace(
      '<meta property="og:title" content="دعوة | استدامة الحبارى" />',
      `<meta property="og:title" content="${newTitle}" />`
    );
    html = html.replace(
      '<meta name="twitter:title" content="دعوة | استدامة الحبارى" />',
      `<meta name="twitter:title" content="${newTitle}" />`
    );
  } catch (e) {
    console.error('Error modifying HTML:', e);
  }

  // Return the modified HTML!
  return new Response(html, {
    status: 200,
    headers: { 
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=0, must-revalidate'
    },
  });
}
