
-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  activities TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  group_size TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  trip TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  content TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample destinations data
INSERT INTO public.destinations (name, region, activities, image, description, highlights) VALUES
('Dahab', 'Red Sea', ARRAY['beach', 'diving', 'adventure'], 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'A laid-back coastal town famous for its world-class diving spots and vibrant coral reefs.', ARRAY['Blue Hole', 'Lighthouse Reef', 'Desert Safari', 'Bedouin Culture']),
('Siwa Oasis', 'Western Desert', ARRAY['desert', 'cultural', 'relaxation'], 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Remote oasis with natural hot springs, salt lakes, and ancient Berber culture.', ARRAY['Cleopatra Spring', 'Salt Lakes', 'Mountain of the Dead', 'Desert Camping']),
('Luxor', 'Upper Egypt', ARRAY['cultural', 'historical'], 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'The world''s greatest open-air museum with magnificent temples and royal tombs.', ARRAY['Valley of Kings', 'Karnak Temple', 'Luxor Temple', 'Hot Air Balloon']),
('White Desert', 'Western Desert', ARRAY['desert', 'adventure', 'photography'], 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Surreal landscape of white limestone formations creating an otherworldly experience.', ARRAY['Unique Rock Formations', 'Desert Camping', 'Stargazing', 'Photography']),
('Alexandria', 'Mediterranean Coast', ARRAY['cultural', 'beach', 'historical'], 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Mediterranean pearl with ancient history, great seafood, and coastal charm.', ARRAY['Bibliotheca Alexandrina', 'Citadel of Qaitbay', 'Corniche', 'Seafood Markets']),
('Fayoum', 'Middle Egypt', ARRAY['cultural', 'nature', 'photography'], 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Hidden oasis with ancient pyramids, fossil discoveries, and pristine nature.', ARRAY['Wadi Al-Hitan', 'Pyramid of Meidum', 'Lake Qarun', 'Wadi Al-Rayan']);

-- Insert sample packages data
INSERT INTO public.packages (title, description, duration, group_size, rating, price, image, highlights) VALUES
('Dahab Diving Adventure', 'Experience world-class diving in the Red Sea with professional guides', '3 Days', '4-8 People', 4.9, '$299', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80', ARRAY['Blue Hole diving', 'Coral garden snorkeling', 'Bedouin dinner']),
('Siwa Oasis Retreat', 'Romantic desert getaway with natural springs and stargazing', '4 Days', '2-6 People', 4.8, '$459', 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee585?auto=format&fit=crop&w=800&q=80', ARRAY['Cleopatra Spring', 'Desert camping', 'Mountain of the Dead']),
('Luxor History Tour', 'Discover ancient Egyptian civilization in the Valley of Kings', '2 Days', '6-12 People', 4.7, '$189', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?auto=format&fit=crop&w=800&q=80', ARRAY['Valley of Kings', 'Karnak Temple', 'Hot air balloon']),
('Fayoum Safari', 'Adventure through Wadi El Rayan and fossil valley discoveries', '1 Day', '4-10 People', 4.6, '$89', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80', ARRAY['Wadi El Rayan waterfalls', 'Wadi El Hitan fossils', 'Sandboarding']);

-- Insert sample experiences data
INSERT INTO public.experiences (title, description, image, category, duration, price) VALUES
('Bedouin Night Under Stars', 'Sleep under the desert stars with traditional Bedouin hospitality', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80', 'Desert', '1 Night', '$75'),
('Nile Felucca Sailing', 'Traditional sailing experience on the timeless Nile River', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?auto=format&fit=crop&w=800&q=80', 'Cultural', '3 Hours', '$45'),
('Egyptian Cooking Class', 'Learn to cook authentic Egyptian dishes with local families', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', 'Cultural', '4 Hours', '$35');

-- Insert sample testimonials data
INSERT INTO public.testimonials (name, location, trip, rating, content, avatar) VALUES
('Sarah Johnson', 'New York, USA', 'Dahab Diving Adventure', 5, 'The diving experience in Dahab was absolutely incredible! The guides were professional and the coral reefs were breathtaking. I saw dolphins and countless tropical fish. This trip exceeded all my expectations!', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80'),
('Marco Silva', 'São Paulo, Brazil', 'Siwa Oasis Retreat', 5, 'Siwa was like stepping into another world. The natural springs, the desert camping, and the incredible hospitality made this an unforgettable experience. Perfect for couples looking for something unique!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
('Emma Thompson', 'London, UK', 'Luxor History Tour', 4, 'As a history enthusiast, Luxor was a dream come true. Walking through the Valley of Kings and seeing the temples up close was magical. The hot air balloon ride at sunrise was the perfect ending to an amazing trip.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80');

-- Enable Row Level Security (make data publicly readable for now)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
