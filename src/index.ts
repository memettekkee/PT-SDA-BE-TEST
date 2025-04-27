import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './routes/userRoute';
import merchantRoute from './routes/merchantRoute';
import productRoute from './routes/productRoute';
import masterDataRoute from './routes/masterDataRoute';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ credentials: true }));

app.use('/api', userRoute)
app.use('/api', merchantRoute)
app.use('/api', productRoute)
app.use('/api', masterDataRoute)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});