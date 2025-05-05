
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import expressFileUpload from 'express-fileupload';
import zohoRoutes from './controllers/zoho';

const path   = require('path')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005; // Default to 3000 if PORT is not in environment

// Initialize database
// initializeDatabase();

app.use(cors());
app.use(expressFileUpload()); // Use express-fileupload before body-parser
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit to 50 MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded payload limit



// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 10000);
*/

//Root route
app.get('/', (req, res) => {
  res.send('Welcome to Zoho API');
});

// Routes
app.use('/api/zoho', zohoRoutes);


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
