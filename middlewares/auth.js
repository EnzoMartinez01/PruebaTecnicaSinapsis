const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.authenticateCustomer = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log('Token recibido:', token);

    if (!token) return res.status(403).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        console.log('Token decodificado:', decoded);

        req.customer = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};