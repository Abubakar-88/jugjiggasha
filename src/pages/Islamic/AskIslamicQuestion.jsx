import React from 'react';
import IslamicQuestionForm from '../../components/Islamic/IslamicQuestionForm';

const AskIslamicQuestion = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <IslamicQuestionForm />
      </div>
    </div>
  );
};

export default AskIslamicQuestion;