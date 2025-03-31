// src/pages/quiz/createQuiz.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("group_id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [error, setError] = useState("");

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      group_id: groupId,
      title,
      description,
      questions: questions.map((text) => ({ text })),
    };

    try {
      const res = await fetch("http://localhost:8001/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create quiz");
      navigate(`/quiz?group_id=${groupId}&role=admin`);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#160F29] mb-6">Create a Quiz</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-[#DDBEA8] shadow space-y-6"
      >
        <div>
          <label className="block mb-2 text-[#246A73] font-semibold">Title</label>
          <input
            className="w-full px-4 py-2 border border-[#DDBEA8] rounded-md focus:ring-2 focus:ring-[#368F8B]"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-[#246A73] font-semibold">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-[#DDBEA8] rounded-md focus:ring-2 focus:ring-[#368F8B]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-[#246A73] font-semibold">Questions</label>
          {questions.map((q, index) => (
            <input
              key={index}
              className="w-full mb-2 px-4 py-2 border border-[#DDBEA8] rounded-md focus:ring-2 focus:ring-[#368F8B]"
              type="text"
              placeholder={`Question ${index + 1}`}
              value={q}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
            />
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 text-sm text-[#368F8B] hover:underline"
          >
            + Add another question
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-[#368F8B] text-white px-6 py-2 rounded-xl hover:bg-[#246A73] transition"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
