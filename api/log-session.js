import { put, list, del } from "@vercel/blob";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

      try {
        const { sessionId, stateCode, timestamp, boardMode } = req.body;

        console.log('Received request:', { sessionId, stateCode, timestamp, boardMode });

        if (!sessionId || !stateCode || !timestamp) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { sessionId: !!sessionId, stateCode: !!stateCode, timestamp: !!timestamp }
            });
        }

    // Updated validation for 6 boards: 6 letters followed by 6 digits
    if (!/^[A-Z]{6}[012]{6}$/.test(stateCode)) {
      return res.status(400).json({ 
        error: 'Invalid state code format',
        received: stateCode,
        expected: '6 letters A-Z followed by 6 digits 0-2'
      });
    }

            // Save session data to blob storage
    const sessionData = {
        sessionId,
        stateCode,
        timestamp: new Date(timestamp).toISOString(),
        boardMode: boardMode || 0,
        updatedAt: new Date().toISOString()
    };

    console.log('Saving session to blob storage:', sessionId);
    
    const { url } = await put(`sessions/${sessionId}.json`, JSON.stringify(sessionData), { 
        access: 'public',
        addRandomSuffix: false
    });

    console.log('Session saved successfully:', url);

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

    // Log the entire database contents
    console.log('=== BLOB STORAGE CONTENTS ===');
    console.log('Total sessions:', allSessions.length);
    allSessions.forEach((session, index) => {
      console.log(`${index + 1}. Session: ${session.sessionId}`);
      console.log(`   State: ${session.stateCode}`);
      console.log(`   Updated: ${session.updatedAt}`);
      console.log('---');
    });
    console.log('============================');

    res.status(200).json({ 
      success: true, 
      message: 'Session state logged successfully',
      totalSessions: allSessions.length
    });

  } catch (error) {
    console.error('Error logging session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 