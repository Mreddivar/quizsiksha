const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://siksha-quiz-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const app = express();
app.use(cors({
  origin: 'https://quizsiksha-6m69.vercel.app',  // ✅ your Vercel frontend
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

app.post('/quiz', async (req, res) => {
  const { title, questions } = req.body;
  const id = uuidv4();
  const quiz = { id, title, questions };
  await db.ref(`quizzes/${id}`).set(quiz);
  res.json(quiz);
});

app.get('/quiz', async (req, res) => {
  const snapshot = await db.ref('quizzes').once('value');
  const quizzes = snapshot.val() || {};
  res.json(Object.values(quizzes));
});

app.post('/submit', async (req, res) => {
  const { quizId, userId, answers } = req.body;
  const snapshot = await db.ref(`quizzes/${quizId}`).once('value');
  const quiz = snapshot.val();
  if (!quiz) return res.status(404).send('Quiz not found');

  const score = quiz.questions.reduce((acc, q, idx) => acc + (q.correct === answers[idx] ? 1 : 0), 0);
  const result = { id: uuidv4(), quizId, userId, score };
  await db.ref(`submissions/${result.id}`).set(result);
  res.json(result);
});

app.get('/submissions', async (req, res) => {
  const snapshot = await db.ref('submissions').once('value');
  const submissions = snapshot.val() || {};
  res.json(Object.values(submissions));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Quiz service running on port ${PORT}`));
