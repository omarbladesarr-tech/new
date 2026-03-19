-- Marketing & Campaigns Tables

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'social', 'ppc', 'content', 'affiliate')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  target_audience JSONB DEFAULT '{}',
  content JSONB DEFAULT '{}',
  schedule JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{"impressions": 0, "clicks": 0, "conversions": 0, "revenue": 0}',
  created_by_agent UUID REFERENCES public.ai_agents(id),
  approved_by UUID REFERENCES public.profiles(id),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_admin_all" ON public.marketing_campaigns FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Marketing Content
CREATE TABLE IF NOT EXISTS public.marketing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'social_post', 'ad_copy', 'blog', 'landing_page')),
  title TEXT,
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'rejected')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  engagement_metrics JSONB DEFAULT '{"views": 0, "likes": 0, "shares": 0, "comments": 0}',
  created_by_agent UUID REFERENCES public.ai_agents(id),
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketing_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_admin_all" ON public.marketing_content FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Email Subscribers
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  source TEXT,
  tags JSONB DEFAULT '[]',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscribers_admin_all" ON public.email_subscribers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube')),
  account_name TEXT NOT NULL,
  account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  metrics JSONB DEFAULT '{"followers": 0, "engagement_rate": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_admin_all" ON public.social_accounts FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);
