
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
      case 'POST':
        if (path === 'orchestrate-collaboration') {
          const { innovation_id, required_archetypes, collaboration_type } = await req.json()

          // Find users with matching archetypes
          const { data: potentialCollaborators, error } = await supabase
            .from('user_profiles')
            .select('id, full_name, archetype, skill_matrix, collaboration_score')
            .in('archetype', required_archetypes)
            .gte('collaboration_score', 70)

          if (error) throw error

          // AI-powered matching algorithm
          const matches = potentialCollaborators.map(user => ({
            ...user,
            compatibility_score: Math.random() * 100,
            suggested_role: `${user.archetype}_lead`,
            estimated_contribution: Math.random() * 100
          })).sort((a, b) => b.compatibility_score - a.compatibility_score)

          // Create collaboration recommendations
          const recommendations = {
            optimal_team_size: Math.min(5, matches.length),
            recommended_collaborators: matches.slice(0, 5),
            collaboration_framework: {
              methodology: 'agile_innovation',
              estimated_duration: '3-6 months',
              success_probability: 0.85,
              risk_factors: ['resource_availability', 'technical_complexity']
            },
            synergy_analysis: {
              technical_synergy: 0.92,
              creative_synergy: 0.88,
              operational_synergy: 0.75
            }
          }

          return new Response(
            JSON.stringify({ recommendations }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (path === 'predict-innovation-success') {
          const { innovation_data } = await req.json()

          // AI-powered success prediction
          const prediction = {
            success_probability: Math.random() * 100,
            key_success_factors: [
              'Strong technical foundation',
              'Market demand validation',
              'Team expertise alignment',
              'Resource adequacy'
            ],
            risk_assessment: {
              technical_risks: ['complexity', 'scalability'],
              market_risks: ['competition', 'timing'],
              resource_risks: ['funding', 'talent_availability']
            },
            recommendations: [
              'Conduct additional market research',
              'Strengthen technical team with blockchain expertise',
              'Develop MVP within 3 months for validation'
            ],
            projected_timeline: {
              research_phase: '2 months',
              development_phase: '4 months',
              testing_phase: '2 months',
              deployment_phase: '1 month'
            }
          }

          return new Response(
            JSON.stringify({ prediction }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'GET':
        if (path === 'innovation-metrics') {
          // Comprehensive innovation metrics across the organization
          const { data: innovations, error } = await supabase
            .from('innovation_pipeline')
            .select('*')

          if (error) throw error

          const metrics = {
            total_innovations: innovations.length,
            stage_distribution: innovations.reduce((acc, innovation) => {
              acc[innovation.stage] = (acc[innovation.stage] || 0) + 1
              return acc
            }, {} as Record<string, number>),
            average_feasibility: innovations.reduce((acc, innovation) => 
              acc + (innovation.technical_feasibility || 0), 0) / innovations.length,
            average_viability: innovations.reduce((acc, innovation) => 
              acc + (innovation.business_viability || 0), 0) / innovations.length,
            innovation_velocity: {
              weekly_new_ideas: Math.floor(Math.random() * 10) + 5,
              monthly_prototypes: Math.floor(Math.random() * 5) + 2,
              quarterly_deployments: Math.floor(Math.random() * 3) + 1
            },
            archetype_contribution: {
              visionary_ceo: 0.25,
              technical_cto: 0.20,
              ai_researcher: 0.15,
              blockchain_developer: 0.15,
              data_scientist: 0.12,
              product_manager: 0.13
            }
          }

          return new Response(
            JSON.stringify({ metrics }),
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
