-- PolicyTwin Database Schema
-- Create tables for the policy simulation application

-- Avatars table to store user-created avatars
CREATE TABLE IF NOT EXISTS avatars (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
    income DECIMAL(12,2) NOT NULL CHECK (income >= 0),
    location VARCHAR(100) NOT NULL,
    family_size INTEGER NOT NULL CHECK (family_size >= 1),
    employment_status VARCHAR(50) NOT NULL,
    health_status VARCHAR(50) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy simulations table to store simulation runs
CREATE TABLE IF NOT EXISTS policy_simulations (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    avatar_id INTEGER NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
    policy_name VARCHAR(200) NOT NULL,
    policy_description TEXT NOT NULL,
    simulation_parameters JSONB NOT NULL, -- Store policy parameters as JSON
    results JSONB, -- Store simulation results as JSON
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages table for the chatbot interface
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    simulation_id INTEGER REFERENCES policy_simulations(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_simulations_user_id ON policy_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_simulations_avatar_id ON policy_simulations(avatar_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_simulation_id ON chat_messages(simulation_id);

-- Create updated_at trigger for avatars
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON avatars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
