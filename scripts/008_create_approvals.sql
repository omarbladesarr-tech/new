-- Human Oversight & Approvals Tables

-- Approval Workflows
CREATE TABLE IF NOT EXISTS public.approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  approval_required_from TEXT[] NOT NULL,
  auto_approve_threshold JSONB,
  notification_channels JSONB DEFAULT '["email", "dashboard"]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_admin_all" ON public.approval_workflows FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Pending Approvals
CREATE TABLE IF NOT EXISTS public.pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.approval_workflows(id),
  task_id UUID REFERENCES public.agent_tasks(id),
  agent_id UUID REFERENCES public.ai_agents(id),
  action_type TEXT NOT NULL,
  action_data JSONB NOT NULL,
  risk_score DECIMAL(3,2),
  risk_factors JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'auto_approved')),
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approvals_admin_all" ON public.pending_approvals FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Human Interventions
CREATE TABLE IF NOT EXISTS public.human_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id),
  task_id UUID REFERENCES public.agent_tasks(id),
  intervention_type TEXT NOT NULL CHECK (intervention_type IN ('override', 'correction', 'guidance', 'pause', 'resume', 'config_change')),
  reason TEXT NOT NULL,
  previous_state JSONB,
  new_state JSONB,
  impact_assessment TEXT,
  performed_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.human_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interventions_admin_all" ON public.human_interventions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Insert default approval workflows
INSERT INTO public.approval_workflows (name, description, trigger_type, conditions, approval_required_from) VALUES
  ('High Value Order', 'Orders exceeding $500 require human approval', 'order_processing', 
   '{"field": "total", "operator": ">=", "value": 500}', 
   ARRAY['admin', 'operator']),
  ('Large Refund', 'Refunds exceeding $100 require human approval', 'refund_processing',
   '{"field": "amount", "operator": ">=", "value": 100}',
   ARRAY['admin', 'operator']),
  ('Marketing Campaign', 'Marketing campaigns with budget over $100/day require approval', 'campaign_launch',
   '{"field": "daily_budget", "operator": ">=", "value": 100}',
   ARRAY['admin']),
  ('New Supplier', 'All new supplier partnerships require human approval', 'supplier_onboarding',
   '{"field": "is_new", "operator": "=", "value": true}',
   ARRAY['admin', 'super_admin']),
  ('Bulk Product Update', 'Updates affecting 50+ products require approval', 'bulk_update',
   '{"field": "affected_count", "operator": ">=", "value": 50}',
   ARRAY['admin', 'operator']),
  ('Price Change', 'Price changes exceeding 20% require approval', 'price_update',
   '{"field": "change_percent", "operator": ">=", "value": 20}',
   ARRAY['admin', 'operator']);
