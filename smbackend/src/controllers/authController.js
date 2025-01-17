const { PrismaClient } = require("@prisma/client");
const  bcrypt  = require("bcryptjs");
const  jwt  = require("jsonwebtoken");

const prisma = new PrismaClient()

const registerAdmin = async(req,res) => {
    const body = req.body;
    try{
      const {email, password} = body ; 
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.admin.create({
        data : {
          email,
          password: hashedPassword
        }    
      })
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.status(200).json({token, user})
    }catch(e){
        return res.status(403).json({error: "signup failed"})
    }	
}

const login = async(req,res) => {
    const body = req.body;
    const { email, password } = body;
    try {
      const user = await prisma.admin.findUnique({ 
        where: { email } 
    });
      if (!user)
        return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) 
        return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };

module.exports = {
    login,
    registerAdmin
};