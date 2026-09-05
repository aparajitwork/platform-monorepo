import cors from 'cors';
import express from 'express';
import { analyticsRouter } from './routes/analytics';
import { inventoryRouter } from './routes/inventory';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'mock-api', domain: ['inventory', 'analytics'] });
})

app.use('/api/inventory', inventoryRouter);
app.use('/api/analytics', analyticsRouter);

app.listen(PORT, () => {
  console.log(`mock-api listening on http://localhost:${PORT}`);
})