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
    console.log('Fetching sessions from blob storage...');
    
    // Get all session files from blob storage
    const { blobs } = await list({ prefix: 'sessions/' });
    
    console.log('Found blobs:', blobs.length);
    blobs.forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname} - ${blob.url}`);
    });
    
    // Read all session data
    const allSessions = [];
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.json')) {
        try {
          console.log(`Reading session: ${blob.pathname}`);
          const response = await fetch(blob.url);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.pathname}: ${response.status} ${response.statusText}`);
            continue;
          }
          
          const sessionData = await response.json();
          console.log(`Successfully read session: ${sessionData.sessionId}`);
          allSessions.push(sessionData);
        } catch (error) {
          console.error(`Error reading session ${blob.pathname}:`, error);
        }
      }
    }

    // Sort by updatedAt (most recent first)
    allSessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    console.log(`Total sessions processed: ${allSessions.length}`);

    // Return the last 5 sessions
    const lastFiveSessions = allSessions.slice(0, 5);

    res.status(200).json({ 
      success: true, 
      sessions: lastFiveSessions,
      totalSessions: allSessions.length,
      debug: {
        totalBlobs: blobs.length,
        jsonBlobs: blobs.filter(b => b.pathname.endsWith('.json')).length,
        processedSessions: allSessions.length
      }
    });

  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 