const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: 'pg_container',
  database: 'mydb',
  user: 'myuser',
  password: 'mypassword'
});

(async () => {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS numbers (
      id SERIAL PRIMARY KEY,
      value INTEGER NOT NULL
    )
  `);
  client.release();
})();

app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/">
      <input type="number" name="number" required>
      <input type="submit" value="Add">
    </form>
    <a href="/list">List Numbers</a>
  `);
});

app.post('/', async (req, res) => {
  const number = parseInt(req.body.number);
  if (!isNaN(number)) {
    await pool.query('INSERT INTO numbers (value) VALUES ($1)', [number]);
  }
  res.redirect('/');
});

app.get('/list', async (req, res) => {
  const result = await pool.query('SELECT * FROM numbers ORDER BY id DESC');
  const list = result.rows.map(row => `${row.id}: ${row.value}`).join('<br>');
  res.send(list);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
