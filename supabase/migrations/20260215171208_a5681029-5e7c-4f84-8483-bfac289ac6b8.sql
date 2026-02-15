
-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience function for current user
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Category images table
CREATE TABLE public.category_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  phone TEXT,
  working_area TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Buildings table
CREATE TABLE public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_number TEXT,
  street_name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_details TEXT,
  custom_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

-- Building assignments table
CREATE TABLE public.building_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE NOT NULL,
  apartment_number TEXT,
  donor_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.building_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: user_roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (public.is_admin());

-- RLS Policies: categories
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies: category_images
CREATE POLICY "Admin full access category_images" ON public.category_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies: volunteers
CREATE POLICY "Admin full access volunteers" ON public.volunteers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies: buildings
CREATE POLICY "Admin full access buildings" ON public.buildings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies: building_assignments
CREATE POLICY "Admin full access building_assignments" ON public.building_assignments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_building_assignments_updated_at BEFORE UPDATE ON public.building_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for category images
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true);

-- Storage RLS policies
CREATE POLICY "Admin can upload category images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images' AND public.is_admin());
CREATE POLICY "Admin can view category images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Admin can delete category images" ON storage.objects FOR DELETE USING (bucket_id = 'category-images' AND public.is_admin());
