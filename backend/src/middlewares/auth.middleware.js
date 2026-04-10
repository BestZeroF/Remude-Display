const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Obtenemos el token del header de la petición
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // Normalmente el token viene como "Bearer eyJhbGci..." así que le quitamos la palabra "Bearer "
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        // Verificamos el token con nuestra palabra secreta del .env
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardamos los datos decodificados en req.user para que el controlador pueda usarlos
        req.user = verified; 
        
        // Le decimos a Express que continúe con la ruta
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = verificarToken;