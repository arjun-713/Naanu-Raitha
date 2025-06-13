
-- Create user profiles table with detailed farming information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  state TEXT,
  district TEXT,
  preferred_mandi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create crops master table for all available crops
CREATE TABLE public.crops_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hindi_name TEXT,
  kannada_name TEXT,
  tamil_name TEXT,
  telugu_name TEXT,
  malayalam_name TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user crops (what they grow)
CREATE TABLE public.user_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops_master(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mandis master table
CREATE TABLE public.mandis_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create active crops table for tracking crop lifecycle
CREATE TABLE public.active_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops_master(id),
  acres DECIMAL,
  planting_date DATE,
  status TEXT DEFAULT 'growing' CHECK (status IN ('growing', 'ready_to_harvest', 'harvested', 'sold')),
  harvest_date DATE,
  total_investment DECIMAL DEFAULT 0,
  selling_price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expenses table for active crops
CREATE TABLE public.crop_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_crop_id UUID REFERENCES active_crops(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  notes TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create crop history for sold crops
CREATE TABLE public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  acres DECIMAL,
  planting_date DATE,
  harvest_date DATE,
  total_investment DECIMAL,
  selling_price DECIMAL,
  profit DECIMAL,
  mandi_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for user_crops
CREATE POLICY "Users can view own crops" ON public.user_crops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crops" ON public.user_crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own crops" ON public.user_crops
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for active_crops
CREATE POLICY "Users can view own active crops" ON public.active_crops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own active crops" ON public.active_crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own active crops" ON public.active_crops
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own active crops" ON public.active_crops
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for crop_expenses
CREATE POLICY "Users can view expenses for own crops" ON public.crop_expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.active_crops 
      WHERE active_crops.id = crop_expenses.active_crop_id 
      AND active_crops.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert expenses for own crops" ON public.crop_expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.active_crops 
      WHERE active_crops.id = crop_expenses.active_crop_id 
      AND active_crops.user_id = auth.uid()
    )
  );

-- Create RLS policies for crop_history
CREATE POLICY "Users can view own crop history" ON public.crop_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop history" ON public.crop_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public read access to master tables
CREATE POLICY "Anyone can view crops master" ON public.crops_master
  FOR SELECT USING (true);
CREATE POLICY "Anyone can view mandis master" ON public.mandis_master
  FOR SELECT USING (true);

-- Insert sample crops data
INSERT INTO public.crops_master (name, hindi_name, category) VALUES
('Wheat', 'गेहूं', 'Cereal'),
('Rice', 'चावल', 'Cereal'),
('Cotton', 'कपास', 'Fiber'),
('Tomato', 'टमाटर', 'Vegetable'),
('Onion', 'प्याज', 'Vegetable'),
('Potato', 'आलू', 'Vegetable'),
('Sugarcane', 'गन्ना', 'Sugar'),
('Maize', 'मक्का', 'Cereal'),
('Soybean', 'सोयाबीन', 'Oilseed'),
('Groundnut', 'मूंगफली', 'Oilseed');

-- Insert sample mandis data (major ones from different states)
INSERT INTO public.mandis_master (name, state, district) VALUES
('APMC Vashi', 'Maharashtra', 'Mumbai'),
('Azadpur Mandi', 'Delhi', 'North Delhi'),
('Koyambedu Market', 'Tamil Nadu', 'Chennai'),
('Yeshwanthpur APMC', 'Karnataka', 'Bangalore'),
('Begur APMC', 'Karnataka', 'Bangalore'),
('Bellary APMC', 'Karnataka', 'Bellary'),
('Raichur APMC', 'Karnataka', 'Raichur'),
('Hubli APMC', 'Karnataka', 'Dharwad'),
('Gulbarga APMC', 'Karnataka', 'Gulbarga'),
('Bijapur APMC', 'Karnataka', 'Bijapur');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
