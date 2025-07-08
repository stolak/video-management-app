-- Create videos table for storing video metadata
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size BIGINT NOT NULL,
  duration INTEGER, -- in seconds
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_at ON videos(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_videos_title ON videos(title);

-- Insert sample data
INSERT INTO videos (title, description, filename, url, size) VALUES
('Sample Video 1', 'This is a sample video for demonstration', 'sample1.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 15728640),
('Sample Video 2', 'Another sample video', 'sample2.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 25165824);
