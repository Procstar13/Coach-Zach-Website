// Chat Session Management API
// This handles storing and retrieving chat sessions for 2-way communication

// In-memory storage for chat sessions (in production, you'd use a database)
const chatSessions = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create or update a chat session
    try {
      const { sessionId, messages, customerPhone, lastActivity } = req.body;
      
      if (!sessionId || !messages) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Store the chat session
      chatSessions.set(sessionId, {
        messages,
        customerPhone,
        lastActivity: lastActivity || new Date().toISOString(),
        createdAt: chatSessions.has(sessionId) ? chatSessions.get(sessionId).createdAt : new Date().toISOString()
      });

      res.status(200).json({ 
        success: true, 
        message: 'Chat session updated',
        sessionId 
      });

    } catch (error) {
      console.error('Error updating chat session:', error);
      res.status(500).json({ error: 'Failed to update chat session' });
    }

  } else if (req.method === 'GET') {
    // Retrieve a chat session
    try {
      const { sessionId } = req.query;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      const session = chatSessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Chat session not found' });
      }

      res.status(200).json({ 
        success: true, 
        session 
      });

    } catch (error) {
      console.error('Error retrieving chat session:', error);
      res.status(500).json({ error: 'Failed to retrieve chat session' });
    }

  } else if (req.method === 'PUT') {
    // Add a message to an existing session
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const session = chatSessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Chat session not found' });
      }

      // Add the new message
      session.messages.push(message);
      session.lastActivity = new Date().toISOString();

      // Update the session
      chatSessions.set(sessionId, session);

      res.status(200).json({ 
        success: true, 
        message: 'Message added to session',
        sessionId 
      });

    } catch (error) {
      console.error('Error adding message to session:', error);
      res.status(500).json({ error: 'Failed to add message to session' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Clean up old sessions (older than 24 hours)
setInterval(() => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  for (const [sessionId, session] of chatSessions.entries()) {
    if (new Date(session.lastActivity) < cutoff) {
      chatSessions.delete(sessionId);
      console.log(`Cleaned up expired session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour
