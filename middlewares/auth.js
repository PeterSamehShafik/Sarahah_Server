import jwt from "jsonwebtoken"

export const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers
            if (authorization.startsWith(process.env.signedUserTokenBearer)) {
                const token = authorization.split(process.env.signedUserTokenBearer)[1]
                const decoded = jwt.verify(token, process.env.signedUserTokenSign)
                if (decoded.user) {
                    req.user = decoded.user
                    next()
                } else {
                    res.json({ message: "invalid token payload" })
                }
            } else {
                res.json({ message: "in-valid token barear" })
            }
        } catch (error) {
            res.json({ message: "catch err in auth", error })
        }
    }
}