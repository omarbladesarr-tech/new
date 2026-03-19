-- Products & Inventory Tables

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('physical', 'digital')),
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  seo_data JSONB DEFAULT '{"title": "", "description": "", "keywords": []}',
  supplier_id UUID REFERENCES public.suppliers(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'out_of_stock')),
  created_by_agent UUID REFERENCES public.ai_agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "products_public_select" ON public.products FOR SELECT 
USING (status = 'active');

-- Admin can manage all products
CREATE POLICY "products_admin_all" ON public.products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Digital Products (for downloadables)
CREATE TABLE IF NOT EXISTS public.digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  download_limit INTEGER DEFAULT 5,
  expiry_days INTEGER DEFAULT 30,
  license_key_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "digital_products_admin_all" ON public.digital_products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Inventory tracking
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 10,
  supplier_stock INTEGER DEFAULT 0,
  last_synced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_admin_all" ON public.inventory FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Product categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_select" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'operator')
  )
);

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('Digital Downloads', 'digital-downloads', 'Digital products and downloadables'),
  ('Software', 'software', 'Software licenses and applications'),
  ('E-Books', 'e-books', 'Digital books and publications'),
  ('Courses', 'courses', 'Online courses and tutorials')
ON CONFLICT (slug) DO NOTHING;
