-- Security & Audit Tables

-- Security Audit Logs
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('user', 'agent', 'system', 'api')),
  actor_id UUID,
  resource_type TEXT,
  resource_id UUID,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_admin_select" ON public.security_audit_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  rate_limit INTEGER DEFAULT 1000,
  requests_today INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users can manage their own API keys
CREATE POLICY "api_keys_own" ON public.api_keys FOR ALL 
USING (user_id = auth.uid());

-- Rate Limits
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('ip', 'user', 'api_key', 'agent')),
  requests INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  window_size_minutes INTEGER DEFAULT 60,
  max_requests INTEGER DEFAULT 1000,
  is_blocked BOOLEAN DEFAULT false,
  blocked_until TIMESTAMPTZ,
  UNIQUE(identifier, identifier_type)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_admin_all" ON public.system_settings FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('agent_auto_approve', '{"enabled": true, "max_value": 500}', 'Auto-approve threshold for agent actions'),
  ('notification_channels', '{"email": true, "slack": false, "webhook": false}', 'Active notification channels'),
  ('maintenance_mode', '{"enabled": false, "message": "System under maintenance"}', 'Maintenance mode settings'),
  ('security_settings', '{"mfa_required": false, "session_timeout_hours": 24, "max_login_attempts": 5}', 'Security configuration'),
  ('agent_limits', '{"max_concurrent_tasks": 50, "max_daily_actions": 1000, "cooldown_minutes": 5}', 'Agent resource limits'),
  ('business_hours', '{"timezone": "UTC", "start": "09:00", "end": "17:00", "days": [1,2,3,4,5]}', 'Business hours for escalation')
ON CONFLICT (key) DO NOTHING;

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON public.notifications FOR ALL 
USING (user_id = auth.uid());
