import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// TypeORM DataSource configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// User routes
app.get('/users', async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create(req.body);
  await userRepository.save(user);
  res.json(user);
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
