import jwt from "jsonwebtoken"

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization
        if (!token) return res.status(401).json({ message: "Requiere Autorización" })
        const payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)
        const date = new Date()
        const expireToken = new Date(payload.expireToken)
        if (date > expireToken) return res.status(401).json({ message: "Se ha caducado la sesión" })
        req.user = payload
        next()
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "No autorizado" })
    }
}

export const isDirector = (req, res, next) => {
    if (req.user.rol == "director") return next();
    return res.status(403).json({ message: "No autorizado" })
}
