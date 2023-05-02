import jtw from "jsonwebtoken"

export const generateToken = (user) => {
    const expiresIn = 12 * 60 * 60 * 1000;
    try {
        const token = jtw.sign(user, process.env.JWT_SECRET, { expiresIn })
        return token 
    } catch (e) {
        console.log(e);
    }
}