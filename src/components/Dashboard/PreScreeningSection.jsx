import AddQuestionForm from "./AddQuestionForm";
import QuestionsList from "./QuestionsList";

const PreScreeningSection = ({ 
  questionForm, 
  handleQuestionChange, 
  handleQuestionSubmit, 
  resetQuestionForm, 
  editingQuestion, 
  addOption, 
  removeOption, 
  setQuestionForm, 
  preScreeningQuestions, 
  editQuestion, 
  deleteQuestion 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <AddQuestionForm 
          questionForm={questionForm}
          handleQuestionChange={handleQuestionChange}
          handleQuestionSubmit={handleQuestionSubmit}
          resetQuestionForm={resetQuestionForm}
          editingQuestion={editingQuestion}
          addOption={addOption}
          removeOption={removeOption}
          setQuestionForm={setQuestionForm}
        />
        <QuestionsList 
          preScreeningQuestions={preScreeningQuestions}
          editQuestion={editQuestion}
          deleteQuestion={deleteQuestion}
        />
      </div>
    </div>
  );
};

export default PreScreeningSection;