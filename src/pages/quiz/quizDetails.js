// src/pages/quiz/quizDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

export default function QuizDetails() {
  const { id } = useParams(); // quiz ID
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8001/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch(() => setError("Failed to load quiz details."));
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      quiz_id: id,
      answers: answers,
    };

    try {
      const res = await fetch("http://localhost:8001/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");
      navigate("/quiz/submitted");
    } catch (err) {
      setError("Submission failed. Please try again.");
    }
  };

  if (!quiz) {
    return (
      <div className="text-center mt-20 text-lg text-[#160F29]">
        {error ? error : "Loading quiz..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#160F29] mb-4">{quiz.title}</h1>
      <p className="mb-6 text-[#368F8B]">{quiz.description}</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 border border-[#DDBEA8] rounded-xl shadow"
      >
        {quiz.questions.map((q, index) => (
          <div key={q.id}>
            <label className="block font-semibold text-[#160F29] mb-2">
              {index + 1}. {q.text}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#DDBEA8] rounded-lg focus:ring-2 focus:ring-[#368F8B]"
              onChange={(e) => handleChange(q.id, e.target.value)}
              value={answers[q.id] || ""}
              required
            />
          </div>
        ))}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {role !== "admin" && (
          <button
            type="submit"
            className="bg-[#246A73] text-white px-6 py-2 rounded-xl hover:bg-[#1b5059] transition"
          >
            Submit Answers
          </button>
        )}
      </form>
    </div>
  );
}
