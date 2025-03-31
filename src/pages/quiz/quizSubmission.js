// src/pages/quiz/quizSubmission.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuizSubmission() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3DFC1] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-[#DDBEA8]">
        <h1 className="text-3xl font-bold text-[#160F29] mb-4">Quiz Submitted!</h1>
        <p className="text-[#246A73] mb-6">
          Thank you for completing the quiz. Your responses have been submitted successfully.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#368F8B] text-white px-6 py-2 rounded-full hover:bg-[#246A73] transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
