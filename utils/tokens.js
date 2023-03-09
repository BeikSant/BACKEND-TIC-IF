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