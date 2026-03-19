-- AI Agents System Tables

-- AI Agents registry
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('master', 'division', 'worker')),
  division TEXT CHECK (division IN ('operations', 'commerce', 'intelligence')),
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'paused', 'error', 'maintenance')),
  capabilities JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{"tasks_completed": 0, "success_rate": 100, "avg_response_time": 0}',
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users with admin/operator role to manage agents
CREATE POLICY "agents_admin_all" ON public.ai_agents FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Agent Tasks queue
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'awaiting_approval')),
  input_data JSONB NOT NULL DEFAULT '{}',
  output_data JSONB,
  error_message TEXT,
  requires_human_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_admin_all" ON public.agent_tasks FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Agent Logs (audit trail)
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.agent_tasks(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_admin_select" ON public.agent_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Agent Tools registry
CREATE TABLE IF NOT EXISTS public.agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  schema JSONB NOT NULL DEFAULT '{}',
  implementation TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  created_by_agent UUID REFERENCES public.ai_agents(id),
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tools_admin_all" ON public.agent_tools FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Insert default AI agents
INSERT INTO public.ai_agents (name, type, division, status, capabilities, config) VALUES
  ('Master Orchestrator', 'master', NULL, 'active', 
   '["task_delegation", "resource_allocation", "system_monitoring", "emergency_response"]',
   '{"max_concurrent_tasks": 100, "escalation_threshold": 0.7}'),
  ('Order Fulfillment Agent', 'worker', 'operations', 'active',
   '["order_processing", "shipment_tracking", "return_handling", "inventory_sync"]',
   '{"auto_approve_orders_under": 500, "max_daily_refund": 1000}'),
  ('Customer Service Agent', 'worker', 'operations', 'active',
   '["ticket_response", "sentiment_analysis", "faq_resolution", "escalation"]',
   '{"response_time_target_minutes": 5, "escalation_sentiment_threshold": 0.3}'),
  ('Product Listing Agent', 'worker', 'commerce', 'active',
   '["listing_creation", "seo_optimization", "pricing_strategy", "image_management"]',
   '{"auto_price_adjustment_percent": 20, "min_profit_margin": 0.15}'),
  ('Marketing Agent', 'worker', 'commerce', 'active',
   '["campaign_creation", "content_scheduling", "ad_management", "analytics"]',
   '{"daily_budget_limit": 100, "auto_approve_content": false}'),
  ('Research Agent', 'worker', 'intelligence', 'active',
   '["market_analysis", "competitor_tracking", "trend_identification", "supplier_evaluation"]',
   '{"research_refresh_hours": 24, "confidence_threshold": 0.7}'),
  ('Tool Creation Agent', 'worker', 'intelligence', 'idle',
   '["automation_design", "workflow_optimization", "integration_development"]',
   '{"require_human_approval": true}')
ON CONFLICT (name) DO NOTHING;
