import jtw from "jsonwebtoken"

export const generateToken = (user) => {
    const expiresIn = 60 * 15;
    try {
        const token = jtw.sign(user, process.env.JWT_SECRET, { expiresIn })
        return { token, expiresIn }
    } catch (e) {
        console.log(e);
    }
}

export const generateRefreshToken = (user, res) => {
    const expiresIn = 60 * 60 * 24 * 30
    try {
        const refreshToken = jtw.sign(user, process.env.JWT_REFRESH, { expiresIn });
        res.cookie("user_token_if", refreshToken, {
            httpOnly: true,
            secure: (process.env.MODO === "desarrollo"),
            expires: new Date(Date.now() + expiresIn * 1000),
            sameSite: "none",
        });
    } catch (error) {
        console.log(e);
    }
}