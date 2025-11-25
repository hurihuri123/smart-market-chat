import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface AdData {
  media?: MediaItem[];
  headline: string;
  primaryText: string;
  buttonText: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the auth token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      console.log('No user found in request')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    const adData: AdData = await req.json()
    
    console.log('Received ad data:', {
      userId: user.id,
      headline: adData.headline,
      primaryText: adData.primaryText,
      buttonText: adData.buttonText,
      mediaCount: adData.media?.length || 0,
    })

    // Validate ad data
    if (!adData.headline || !adData.primaryText || !adData.buttonText) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: headline, primaryText, or buttonText' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Here you can add logic to:
    // 1. Save the ad data to database
    // 2. Process media files
    // 3. Submit to Facebook API
    // 4. Store campaign information
    
    console.log('Ad submission successful for user:', user.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'המודעה נשלחה בהצלחה',
        adId: crypto.randomUUID(), // Generate a temporary ID
        data: adData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing ad submission:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})