import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title: '', questions: [{ question: '', options: ['', '', '', ''], correct: '' }] });

  useEffect(() => {
    axios.get('http://localhost:3002/quiz').then(res => setQuizzes(res.data));
  }, []);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const res = await axios.post('http://localhost:3002/submit', {
      quizId: selectedQuiz.id,
      userId: 'demo-user',
      answers,
    });
    setResult(res.data);
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correct: '' }],
    });
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...newQuiz.questions];
    if (field === 'question') updated[idx].question = value;
    if (field.startsWith('opt')) updated[idx].options[parseInt(field.slice(3))] = value;
    if (field === 'correct') updated[idx].correct = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const createQuiz = async () => {
    await axios.post('http://localhost:3002/quiz', newQuiz);
    const res = await axios.get('http://localhost:3002/quiz');
    setQuizzes(res.data);
    setNewQuiz({ title: '', questions: [{ question: '', options: ['', '', '', ''], correct: '' }] });
  };

  if (selectedQuiz) {
    return (
      <div className="container">
        <h2 className="title">{selectedQuiz.title}</h2>
        {selectedQuiz.questions.map((q, i) => (
          <div key={i} className="question-block">
            <p className="question-text">{q.question}</p>
            {q.options.map((opt, j) => (
              <label key={j} className="option">
                <input
                  type="radio"
                  name={`q-${i}`}
                  value={opt}
                  onChange={() => handleAnswerChange(i, opt)}
                /> {opt}
              </label>
            ))}
          </div>
        ))}
        <button className="btn" onClick={handleSubmit}>Submit</button>
        {result && <p className="score">Your Score: {result.score}</p>}
        <button className="btn" onClick={() => setSelectedQuiz(null)}>Back to Quizzes</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Available Quizzes</h1>
      {quizzes.map(q => (
        <div key={q.id} className="quiz-item" onClick={() => setSelectedQuiz(q)}>{q.title}</div>
      ))}

      <h2 className="subtitle">Create a New Quiz</h2>
      <input
        className="input"
        placeholder="Quiz Title"
        value={newQuiz.title}
        onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })}
      />
      {newQuiz.questions.map((q, i) => (
        <div key={i} className="question-block">
          <input
            className="input"
            placeholder="Question"
            value={q.question}
            onChange={e => updateQuestion(i, 'question', e.target.value)}
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              className="input"
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={e => updateQuestion(i, `opt${j}`, e.target.value)}
            />
          ))}
          <input
            className="input"
            placeholder="Correct Answer"
            value={q.correct}
            onChange={e => updateQuestion(i, 'correct', e.target.value)}
          />
        </div>
      ))}
      <button className="btn" onClick={addQuestion}>Add Question</button>
      <button className="btn" onClick={createQuiz}>Create Quiz</button>
    </div>
  );
}

export default App;