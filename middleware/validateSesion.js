import jwt from "jsonwebtoken"

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization
        if (!token) return res.status(401).json({ message: "Autorización Requerida" })
        const payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)
        req.user = payload
        next()
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Autorización Requerida" })
    }
}

export const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.user_token_if
        if (!refreshTokenCookie) throw new Error("No existe el token");
        const payload = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Autorización Requerida" })
    }
}

export const isDirector = (req, res, next) => {
    if (req.user.rol == "director") return next();
    return res.status(401).json({ message: "No autorizado" })
}