import { load } from "npm:cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
  }

  try {
    const { url, trackingId } = await req.json();

    // Validate URL
    if (!url || !trackingId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL and tracking ID are required' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Ensure URL has protocol
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
      // Fetch the webpage
      const response = await fetch(targetUrl);
      if (!response.ok) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to fetch website: ${response.statusText}` 
          }),
          { status: response.status, headers: corsHeaders }
        );
      }
      
      const html = await response.text();

      // Load HTML into cheerio
      const $ = load(html);

      // Look for the tracking script
      const scripts = $('script').map((_, el) => $(el).html()).get();
      
      // Check for both script source and initialization
      const hasTrackerScript = scripts.some(script => 
        script && script.includes('BrowserBotTracker') && 
        script.includes(trackingId)
      );

      const hasTrackerInit = scripts.some(script =>
        script && script.includes(`BrowserBotTracker('init', '${trackingId}')`)
      );

      const pixelFound = hasTrackerScript && hasTrackerInit;

      return new Response(
        JSON.stringify({ 
          success: true,
          pixelFound,
          message: pixelFound ? 'Tracking pixel detected' : 'Tracking pixel not found or incorrectly installed' 
        }),
        { headers: corsHeaders }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to scan website: ${error.message}` 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Invalid request format' 
      }),
      { status: 400, headers: corsHeaders }
    );
  }
});