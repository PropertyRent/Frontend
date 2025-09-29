import { FiFileText, FiEdit3, FiTrash2 } from "react-icons/fi";

const QuestionsList = ({ preScreeningQuestions, editQuestion, deleteQuestion }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-tan)]/20">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)]">
            Screening Questions ({preScreeningQuestions.length})
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            These questions will appear on the pre-screening form
          </p>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {preScreeningQuestions.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-muted)]">
              <FiFileText className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No questions added yet. Create your first screening question.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-tan)]/20">
              {preScreeningQuestions.map((question, index) => (
                <div key={question.id} className="p-6 hover:bg-[var(--color-bg)] transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[var(--color-secondary)] bg-[var(--color-light)] px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                          {question.type}
                        </span>
                        {question.required && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-[var(--color-darkest)] mb-2">{question.question}</h4>
                      {question.placeholder && (
                        <p className="text-sm text-[var(--color-muted)] mb-2">
                          Placeholder: "{question.placeholder}"
                        </p>
                      )}
                      {question.options && question.options.length > 0 && (
                        <div className="text-sm text-[var(--color-muted)]">
                          Options: {question.options.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editQuestion(question)}
                        className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-lg transition-colors"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;