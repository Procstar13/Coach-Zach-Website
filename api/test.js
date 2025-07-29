const testHandler = async (req, res) => {
    console.log('Test API endpoint called');
    
    return res.status(200).json({ 
        message: 'Test API working',
        timestamp: new Date().toISOString(),
        method: req.method
    });
};

// Export for Vercel
module.exports = testHandler;