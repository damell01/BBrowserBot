import { load } from "npm:cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, trackingId } = await req.json();

    // Validate URL
    if (!url || !trackingId) {
      return new Response(
        JSON.stringify({ error: 'URL and tracking ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the webpage
    const response = await fetch(url);
    const html = await response.text();

    // Load HTML into cheerio
    const $ = load(html);

    // Look for the tracking script
    const scripts = $('script').map((_, el) => $(el).html()).get();
    const pixelFound = scripts.some(script => 
      script && script.includes('LeadSyncTracker') && script.includes(trackingId)
    );

    // Update user's pixel status in the database if found
    if (pixelFound) {
      // In a real implementation, you would update the database here
      console.log(`Pixel found for tracking ID: ${trackingId}`);
    }

    return new Response(
      JSON.stringify({ 
        pixelFound,
        message: pixelFound ? 'Tracking pixel detected' : 'Tracking pixel not found' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to scan website' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});