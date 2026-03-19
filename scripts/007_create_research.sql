-- Research & Intelligence Tables

-- Market Research
CREATE TABLE IF NOT EXISTS public.market_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_type TEXT NOT NULL CHECK (research_type IN ('product', 'competitor', 'trend', 'pricing', 'supplier', 'market')),
  subject TEXT NOT NULL,
  findings JSONB NOT NULL,
  recommendations JSONB DEFAULT '[]',
  confidence_score DECIMAL(3,2),
  sources JSONB DEFAULT '[]',
  data_points JSONB DEFAULT '{}',
  conducted_by_agent UUID REFERENCES public.ai_agents(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  is_actionable BOOLEAN DEFAULT false,
  action_taken BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.market_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "research_admin_all" ON public.market_research FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Competitor Tracking
CREATE TABLE IF NOT EXISTS public.competitor_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name TEXT NOT NULL,
  website_url TEXT,
  products_tracked JSONB DEFAULT '[]',
  pricing_data JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  market_position TEXT,
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.competitor_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "competitors_admin_all" ON public.competitor_tracking FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Trend Analysis
CREATE TABLE IF NOT EXISTS public.trend_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  impact_score DECIMAL(3,2),
  relevance_score DECIMAL(3,2),
  growth_rate DECIMAL(5,2),
  data_sources JSONB DEFAULT '[]',
  keywords JSONB DEFAULT '[]',
  related_products JSONB DEFAULT '[]',
  status TEXT DEFAULT 'emerging' CHECK (status IN ('emerging', 'growing', 'peak', 'declining', 'stable')),
  identified_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trend_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trends_admin_all" ON public.trend_analysis FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Product Opportunities
CREATE TABLE IF NOT EXISTS public.product_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  estimated_demand INTEGER,
  estimated_margin DECIMAL(5,2),
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  sourcing_difficulty TEXT CHECK (sourcing_difficulty IN ('easy', 'moderate', 'difficult')),
  recommended_price DECIMAL(10,2),
  potential_suppliers JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  score DECIMAL(3,2),
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'evaluating', 'approved', 'rejected', 'launched')),
  identified_by_agent UUID REFERENCES public.ai_agents(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opportunities_admin_all" ON public.product_opportunities FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);
