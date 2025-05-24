import express from 'express';
import dotnev from 'dotenv';
import {connectDB} from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import itemRoutes from './routes/item.route.js';


dotnev.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};


app.use(cors(corsOptions)); 
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log('Server started on http://localhost:'+ PORT);
});


