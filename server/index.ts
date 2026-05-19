import { createApp } from './app';

const port = Number(process.env.PORT ?? 4177);
const app = createApp();

app.listen(port, () => {
  console.log(`Chloe hologram API listening on http://localhost:${port}`);
});
