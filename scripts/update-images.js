const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Starting image update script...');

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Sample image URLs for news articles
const newsImages = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092335397-9fa73e7d0d1b?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092160607-ee22731c2eaf?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1470&auto=format&fit=crop'
];

// Sample author avatar URLs
const authorAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop'
];

async function updateNewsImages() {
  const client = await pool.connect();
  try {
    // Update news images
    for (let i = 1; i <= 5; i++) {
      await client.query(
        'UPDATE news SET image_url = $1 WHERE id = $2',
        [newsImages[i-1], i]
      );
      console.log(`Updated image for news ID ${i}`);
    }

    // Update author avatars
    for (let i = 1; i <= 5; i++) {
      await client.query(
        'UPDATE authors SET avatar_url = $1 WHERE id = $2',
        [authorAvatars[i-1], i]
      );
      console.log(`Updated avatar for author ID ${i}`);
    }

    console.log('All images updated successfully!');
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    client.release();
  }
}

// Run the update function
updateNewsImages().then(() => {
  pool.end();
});