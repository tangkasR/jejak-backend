import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import AdminRoute from './routes/AdminRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import db from './config/Database.js';

dotenv.config();
const app = express();

// migrasi
// (async () => {
//   await db.sync();
// })();
// end migrasi

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use(AdminRoute);
app.use(AuthRoute);



app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running in port ${process.env.APP_PORT}...`);
});
