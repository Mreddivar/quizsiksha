import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

export default function QuizDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const groupId = searchParams.get("group_id");
  const role = searchParams.get("role");

  const goToCreateQuiz = () => navigate(`/quiz/create?group_id=${groupId}`);

  useEffect(() => {
    if (!groupId) return;

    // Mock quiz data (replace with actual API fetch later)
    const mockQuizzes = [
      { id: 'quiz1', title: 'Marine Biology Basics' },
      { id: 'quiz2', title: 'Ocean Temperature Trends' },
      { id: 'quiz3', title: 'Rainfall & Coastal Data' },
    ];

    setQuizzes(mockQuizzes);
  }, [groupId]);

  return (
    <div className="min-h-screen bg-[#F3DFC1] py-10 px-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#160F29]">
          Available Quizzes for Group <span className="text-[#246A73]">{groupId}</span>
        </h1>
        {role === 'admin' && (
          <button
            onClick={goToCreateQuiz}
            className="bg-[#246A73] hover:bg-[#160F29] text-white font-medium px-4 py-2 rounded-xl shadow transition-all duration-300"
          >
            + Create Quiz
          </button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <p className="text-[#368F8B]">No quizzes found for this group.</p>
      ) : (
        <ul className="space-y-5">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="bg-white border border-[#DDBEA8] p-5 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#160F29]">{quiz.title}</h2>
                  <p className="text-sm text-[#368F8B] mt-1">This is a short description of the quiz.</p>
                </div>
                <button
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  className="flex items-center gap-2 bg-[#368F8B] hover:bg-[#246A73] text-white px-4 py-2 rounded-lg transition-all"
                >
                  <FaPlay /> Take Quiz
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
