-- Coach Zach Soccer Training CRM Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parent_name TEXT NOT NULL,
    parent_email TEXT UNIQUE NOT NULL,
    parent_phone TEXT,
    address TEXT,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER CHECK (age >= 3 AND age <= 18),
    skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    goals TEXT,
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('1on1', 'group', 'assessment')),
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    location TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'check', 'venmo', 'zelle')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(parent_email);
CREATE INDEX idx_players_customer_id ON players(customer_id);
CREATE INDEX idx_sessions_player_id ON sessions(player_id);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_payments_session_id ON payments(session_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access (you'll need to create an admin role)
-- For now, we'll allow all authenticated users to read all data
-- In production, you'd want more restrictive policies

-- Customers policies
CREATE POLICY "Allow authenticated users to read customers" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert customers" ON customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update customers" ON customers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Players policies
CREATE POLICY "Allow authenticated users to read players" ON players
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert players" ON players
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update players" ON players
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Sessions policies
CREATE POLICY "Allow authenticated users to read sessions" ON sessions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert sessions" ON sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sessions" ON sessions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Payments policies
CREATE POLICY "Allow authenticated users to read payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert payments" ON payments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update payments" ON payments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create views for common queries
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.parent_name,
    c.parent_email,
    c.parent_phone,
    COUNT(p.id) as player_count,
    COUNT(s.id) as total_sessions,
    COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
    SUM(CASE WHEN s.status = 'completed' THEN s.price ELSE 0 END) as total_revenue
FROM customers c
LEFT JOIN players p ON c.id = p.customer_id
LEFT JOIN sessions s ON p.id = s.player_id
GROUP BY c.id, c.parent_name, c.parent_email, c.parent_phone;

CREATE VIEW session_summary AS
SELECT 
    s.id,
    s.date,
    s.time,
    s.session_type,
    s.status,
    s.price,
    p.name as player_name,
    p.age as player_age,
    c.parent_name,
    c.parent_email,
    COALESCE(pay.status, 'unpaid') as payment_status
FROM sessions s
JOIN players p ON s.player_id = p.id
JOIN customers c ON p.customer_id = c.id
LEFT JOIN payments pay ON s.id = pay.session_id;

-- Insert some sample data for testing
INSERT INTO customers (parent_name, parent_email, parent_phone) VALUES
('John Smith', 'john.smith@email.com', '(480) 555-0101'),
('Sarah Johnson', 'sarah.johnson@email.com', '(480) 555-0102'),
('Mike Davis', 'mike.davis@email.com', '(480) 555-0103');

INSERT INTO players (customer_id, name, age, skill_level, goals) VALUES
((SELECT id FROM customers WHERE parent_email = 'john.smith@email.com'), 'Alex Smith', 12, 'intermediate', 'Improve dribbling and shooting'),
((SELECT id FROM customers WHERE parent_email = 'sarah.johnson@email.com'), 'Emma Johnson', 10, 'beginner', 'Learn basic soccer skills'),
((SELECT id FROM customers WHERE parent_email = 'mike.davis@email.com'), 'Lucas Davis', 14, 'advanced', 'Prepare for high school tryouts');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 