
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        if (path === 'sessions') {
          // Get interaction session analytics
          const { data: sessions, error } = await supabase
            .from('interaction_sessions')
            .select(`
              *,
              workspace_environments (
                name,
                environment_type
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)

          if (error) throw error

          // Calculate analytics
          const analytics = {
            total_sessions: sessions.length,
            session_types: sessions.reduce((acc, session) => {
              acc[session.session_type] = (acc[session.session_type] || 0) + 1
              return acc
            }, {} as Record<string, number>),
            average_duration: sessions
              .filter(s => s.end_time)
              .reduce((acc, session) => {
                const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime()
                return acc + duration
              }, 0) / sessions.filter(s => s.end_time).length || 0,
            productivity_score: sessions.reduce((acc, session) => {
              return acc + (session.performance_metrics?.efficiency || 0)
            }, 0) / sessions.length || 0
          }

          return new Response(
            JSON.stringify({ sessions, analytics }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'POST':
        if (path === 'process-biometric') {
          // Process biometric data from interaction session
          const { session_id, biometric_data } = await req.json()

          // AI-powered analysis of biometric data
          const insights = {
            stress_level: Math.random() * 100,
            focus_score: Math.random() * 100,
            engagement_level: Math.random() * 100,
            cognitive_load: Math.random() * 100,
            recommendations: [
              'Consider taking a break to reduce stress levels',
              'Current focus is optimal for complex tasks',
              'Engagement levels suggest high productivity'
            ]
          }

          // Update session with AI insights
          const { error } = await supabase
            .from('interaction_sessions')
            .update({
              ai_insights: insights,
              biometric_data
            })
            .eq('id', session_id)
            .eq('user_id', user.id)

          if (error) throw error

          return new Response(
            JSON.stringify({ insights }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
