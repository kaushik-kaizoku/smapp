const express = require('express');
const  multer  = require('multer'); 
const cors = require('cors');
const path = require('path');
const { authenticate } = require('./middleware/authMiddleware');
const { login, registerAdmin } = require('./controllers/authController');
const { createUser, fetchUsers } = require('./controllers/imageController');


const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post('/api/submit',upload.array('images'), createUser);
app.post('/api/login',login);
app.post('/api/register',registerAdmin);
app.get('/api/users', authenticate, fetchUsers);

app.listen(port, () => {
    console.log(`Server is running at PORT ${port}`)
});