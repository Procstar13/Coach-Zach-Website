export default async function handler(req, res) {
    console.log('Test API endpoint called');
    
    return res.status(200).json({ 
        message: 'Test API working',
        timestamp: new Date().toISOString(),
        method: req.method
    });
}