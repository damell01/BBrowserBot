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

    // Validate URL and trackingId
    if (!url) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL is required' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!trackingId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Tracking ID is required' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Ensure URL has protocol
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
      console.log(`Scanning website: ${targetUrl}`);
      
      // Fetch the webpage with a timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(targetUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'BrowserBot-Verification/1.0'
        }
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to fetch website: ${response.status} ${response.statusText}` 
          }),
          { status: response.status, headers: corsHeaders }
        );
      }
      
      const html = await response.text();
      console.log('Successfully fetched HTML content');

      // Load HTML into cheerio
      const $ = load(html);
      console.log('Parsed HTML with cheerio');

      // Look for the tracking script
      const scripts = $('script').map((_, el) => $(el).html()).get();
      console.log(`Found ${scripts.length} script tags`);
      
      // Check for BrowserBotTracker initialization
      const hasTrackerInit = scripts.some(script => {
        if (!script) return false;
        const hasTracker = script.includes('BrowserBotTracker');
        const hasTrackingId = script.includes(`BrowserBotTrackingID`);
        const hasCorrectId = script.includes(trackingId);
        console.log('Script check:', { hasTracker, hasTrackingId, hasCorrectId });
        return hasTracker && hasTrackingId && hasCorrectId;
      });

      // Check for tracker.js script
      const hasTrackerScript = $('script[src*="tracker.js"]').length > 0;
      console.log('Tracker script found:', hasTrackerScript);

      const pixelFound = hasTrackerScript && hasTrackerInit;

      return new Response(
        JSON.stringify({ 
          success: true,
          pixelFound,
          message: pixelFound 
            ? 'Tracking pixel detected successfully' 
            : 'Tracking pixel not found or incorrectly installed. Please ensure the script is added to the <head> section of your website.' 
        }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('Error scanning website:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Request timed out. Please check if the website is accessible.' 
          }),
          { status: 408, headers: corsHeaders }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to scan website: ${error.message}` 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Invalid request format or missing required fields' 
      }),
      { status: 400, headers: corsHeaders }
    );
  }
});