import { put, list } from "@vercel/blob";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Test writing to blob storage
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Blob storage test'
      };

      const { url } = await put('test-blob.json', JSON.stringify(testData), { 
        access: 'public',
        addRandomSuffix: false
      });

      console.log('Test blob created:', url);

      res.status(200).json({ 
        success: true, 
        message: 'Test blob created successfully',
        url: url
      });

    } catch (error) {
      console.error('Error creating test blob:', error);
      res.status(500).json({ 
        error: 'Failed to create test blob',
        details: error.message 
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Test reading from blob storage
      const { blobs } = await list({ prefix: 'test-' });
      
      console.log('Test blobs found:', blobs.length);

      res.status(200).json({ 
        success: true, 
        message: 'Blob storage is working',
        testBlobs: blobs.length,
        blobs: blobs.map(b => ({ pathname: b.pathname, url: b.url }))
      });

    } catch (error) {
      console.error('Error reading test blobs:', error);
      res.status(500).json({ 
        error: 'Failed to read test blobs',
        details: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 