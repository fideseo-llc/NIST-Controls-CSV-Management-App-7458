import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database pool configuration
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Controls endpoints
app.get('/api/controls', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM controls');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

app.post('/api/controls', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { controlId, controlName, family, class: controlClass, controlText, supplementalGuidance, relatedControls, priority } = req.body;
    
    const result = await conn.query(
      'INSERT INTO controls (controlId, controlName, family, class, controlText, supplementalGuidance, relatedControls, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [controlId, controlName, family, controlClass, controlText, supplementalGuidance, relatedControls, priority]
    );
    
    res.status(201).json({ message: 'Control created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

app.put('/api/controls/:id', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { controlId, controlName, family, class: controlClass, controlText, supplementalGuidance, relatedControls, priority } = req.body;
    
    await conn.query(
      'UPDATE controls SET controlName = ?, family = ?, class = ?, controlText = ?, supplementalGuidance = ?, relatedControls = ?, priority = ? WHERE controlId = ?',
      [controlName, family, controlClass, controlText, supplementalGuidance, relatedControls, priority, controlId]
    );
    
    res.json({ message: 'Control updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

app.delete('/api/controls/:id', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM controls WHERE controlId = ?', [req.params.id]);
    res.json({ message: 'Control deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Auth endpoints
app.post('/api/login', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { username, password } = req.body;
    
    const users = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});