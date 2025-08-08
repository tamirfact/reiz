import { list } from "@vercel/blob";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all session files from blob storage
    const { blobs } = await list({ prefix: 'sessions/' });
    
    // Read all session data
    const allSessions = [];
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.json')) {
        try {
          const response = await fetch(blob.url);
          const sessionData = await response.json();
          allSessions.push(sessionData);
        } catch (error) {
          console.error(`Error reading session ${blob.pathname}:`, error);
        }
      }
    }

    // Sort by updatedAt (most recent first)
    allSessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Return the last 5 sessions
    const lastFiveSessions = allSessions.slice(0, 5);

    res.status(200).json({ 
      success: true, 
      sessions: lastFiveSessions,
      totalSessions: allSessions.length
    });

  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 