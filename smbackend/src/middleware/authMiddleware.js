const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();


const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const user = await  prisma.admin.findUnique({
            where: {
              id: req.userId,
            },
          })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authenticate
}