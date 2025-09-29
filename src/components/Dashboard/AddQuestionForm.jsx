import { FiSave, FiTrash2, FiPlus } from "react-icons/fi";

const AddQuestionForm = ({ 
  questionForm, 
  handleQuestionChange, 
  handleQuestionSubmit, 
  resetQuestionForm, 
  editingQuestion, 
  addOption, 
  removeOption, 
  setQuestionForm 
}) => {
  return (
    <div className="lg:col-span-1">
      <form onSubmit={handleQuestionSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">
          {editingQuestion ? 'Edit Question' : 'Add Question'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Question Text</label>
            <input
              name="question"
              value={questionForm.question}
              onChange={handleQuestionChange}
              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Enter your question"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Input Type</label>
            <select
              name="type"
              value={questionForm.type}
              onChange={handleQuestionChange}
              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select Dropdown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Placeholder Text</label>
            <input
              name="placeholder"
              value={questionForm.placeholder}
              onChange={handleQuestionChange}
              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Placeholder text (optional)"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="required"
              checked={questionForm.required}
              onChange={(e) => setQuestionForm(prev => ({ ...prev, required: e.target.checked }))}
              className="rounded border-[var(--color-tan)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
            />
            <label className="text-sm text-[var(--color-darkest)]">Required field</label>
          </div>

          {questionForm.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">Options</label>
              <div className="space-y-2">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index] = e.target.value;
                        setQuestionForm(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="flex-1 p-2 border border-[var(--color-tan)]/50 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
                      placeholder="Option text"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 p-2 text-[var(--color-secondary)] hover:bg-[var(--color-light)] rounded transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <FiSave className="inline mr-2" />
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </button>
          {editingQuestion && (
            <button
              type="button"
              onClick={resetQuestionForm}
              className="px-4 py-3 border border-[var(--color-tan)] rounded-lg hover:bg-[var(--color-light)] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddQuestionForm;