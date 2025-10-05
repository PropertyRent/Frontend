import React, { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiSend,
  FiUsers,
  FiMessageSquare,
  FiClock,
  FiHash,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import ScreeningService from '../../services/screeningService';
import ConfirmationModal from '../ConfirmationModal';

const ScreeningManagement = () => {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'reply', 'questions'
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('responses'); // 'responses', 'questions'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: '',
    itemName: '',
    isLoading: false
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    has_prev: false
  });

  // Reply form state
  const [replyForm, setReplyForm] = useState({
    reply_message: ''
  });

  // Question creation state
  const [questionForm, setQuestionForm] = useState({
    questions: [{
      question_text: '',
      question_type: 'text',
      is_required: true,
      placeholder_text: '',
    }]
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    replied: 0,
    unreplied: 0
  });

  useEffect(() => {
    if (activeTab === 'responses') {
      fetchResponses();
    } else {
      fetchQuestions();
    }
  }, [searchTerm, activeTab, pagination.offset]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await ScreeningService.getAllResponses({
        limit: pagination.limit,
        offset: pagination.offset,
        search: searchTerm || undefined
      });

      if (response.success) {
        setResponses(response.data.responses);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          has_next: response.data.pagination.has_next,
          has_prev: response.data.pagination.has_prev
        }));
        
        // Calculate statistics
        const replied = response.data.responses.filter(resp => resp.has_admin_reply).length;
        setStats({
          total: response.data.pagination.total,
          replied: replied,
          unreplied: response.data.pagination.total - replied
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast.error('Failed to fetch screening responses');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await ScreeningService.getActiveQuestions();
      if (response.success) {
        setQuestions(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch screening questions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponse = async (response) => {
    try {
      const detailResponse = await ScreeningService.getResponseById(response.id);
      if (detailResponse.success) {
        setSelectedResponse(detailResponse.data);
        setModalMode('view');
        setShowModal(true);
      } else {
        toast.error(detailResponse.message);
      }
    } catch (error) {
      console.error('Error fetching response details:', error);
      toast.error('Failed to fetch response details');
    }
  };

  const handleReplyToResponse = (response) => {
    setSelectedResponse(response);
    setModalMode('reply');
    setReplyForm({ reply_message: '' });
    setShowModal(true);
  };

  const handleSubmitReply = async () => {
    if (!replyForm.reply_message.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ScreeningService.replyToResponse(selectedResponse.id, replyForm);

      if (response.success) {
        toast.success('Reply sent successfully');
        setShowModal(false);
        setReplyForm({ reply_message: '' });
        fetchResponses();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResponseClick = (response) => {
    setConfirmModal({
      isOpen: true,
      itemId: response.id,
      itemType: 'response',
      itemName: response.user_name || 'Unknown User',
      isLoading: false
    });
  };

  const handleDeleteResponse = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await ScreeningService.deleteResponse(confirmModal.itemId);
      if (response.success) {
        toast.success('Response deleted successfully');
        fetchResponses();
        setConfirmModal({ isOpen: false, itemId: null, itemType: '', itemName: '', isLoading: false });
      } else {
        toast.error(response.message);
        setConfirmModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting response:', error);
      toast.error('Failed to delete response');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteQuestionClick = (question) => {
    setConfirmModal({
      isOpen: true,
      itemId: question.id,
      itemType: 'question',
      itemName: question.question_text,
      isLoading: false
    });
  };

  const handleDeleteQuestion = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await ScreeningService.deleteQuestion(confirmModal.itemId);
      if (response.success) {
        toast.success('Question deleted successfully');
        fetchQuestions();
        setConfirmModal({ isOpen: false, itemId: null, itemType: '', itemName: '', isLoading: false });
      } else {
        toast.error(response.message);
        setConfirmModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleConfirmDelete = () => {
    if (confirmModal.itemType === 'response') {
      handleDeleteResponse();
    } else if (confirmModal.itemType === 'question') {
      handleDeleteQuestion();
    }
  };

  const handleCloseModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({ isOpen: false, itemId: null, itemType: '', itemName: '', isLoading: false });
    }
  };

  const handleCreateQuestions = async () => {
    // Validate questions
    const validQuestions = questionForm.questions.filter(q => q.question_text.trim());
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting questions:', validQuestions);
      const response = await ScreeningService.bulkCreateQuestions({
        questions: validQuestions
      });

      if (response.success) {
        toast.success(`${response.data.created_questions.length} questions created successfully`);
        setShowModal(false);
        setQuestionForm({
          questions: [{
            question_text: '',
            question_type: 'text',
            is_required: true,
            placeholder_text: '',
          }]
        });
        fetchQuestions();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error creating questions:', error);
      toast.error('Failed to create questions');
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    setQuestionForm(prev => ({
      questions: [...prev.questions, {
        question_text: '',
        question_type: 'text',
        is_required: true,
        placeholder_text: '',
      }]
    }));
  };

  const removeQuestion = (index) => {
    setQuestionForm(prev => ({
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, field, value) => {
    setQuestionForm(prev => ({
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResponse(null);
    setReplyForm({ reply_message: '' });
  };

  const StatCard = ({ title, count, color, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const renderQuestionTypeIcon = (type) => {
    switch (type) {
      case 'text': return <FiFileText className="w-4 h-4" />;
      case 'number': return <FiHash className="w-4 h-4" />;
      case 'date': return <FiCalendar className="w-4 h-4" />;
      case 'yesno': return <FiToggleLeft className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="w-full h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-Screening Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage screening questions and review user responses
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setModalMode('questions');
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Questions
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('responses')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'responses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiUsers className="w-4 h-4 inline mr-2" />
              Responses ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiFileText className="w-4 h-4 inline mr-2" />
              Questions ({questions.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Statistics Cards */}
      {activeTab === 'responses' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Responses" count={stats.total} color="#3B82F6" icon={FiUsers} />
          <StatCard title="Replied" count={stats.replied} color="#10B981" icon={FiCheck} />
          <StatCard title="Pending Reply" count={stats.unreplied} color="#F59E0B" icon={FiClock} />
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'responses' ? "Search by name or email..." : "Search questions..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'responses' ? (
        // Responses Tab
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Screening Responses</h2>
          </div>
          
          {responses.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No responses found</h3>
              <p className="text-gray-500">No screening responses match your current search.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Answers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {response.full_name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FiMail className="w-3 h-3 mr-1" />
                                {response.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FiPhone className="w-3 h-3 mr-1" />
                                {response.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {response.answers_count} answers
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            response.has_admin_reply 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {response.has_admin_reply ? 'Replied' : 'Pending Reply'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            {ScreeningService.formatDate(response.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewResponse(response)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReplyToResponse(response)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Send Reply"
                            >
                              <FiSend className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteResponseClick(response)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Response"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                      disabled={!pagination.has_prev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                      disabled={!pagination.has_next}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.offset + pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                          disabled={!pagination.has_prev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                          disabled={!pagination.has_next}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Questions Tab
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Screening Questions</h2>
          </div>
          
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-500">Create your first screening question to get started.</p>
              <button
                onClick={() => {
                  setModalMode('questions');
                  setShowModal(true);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Questions
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {question.order}
                        </span>
                        <div className="flex items-center space-x-2">
                          {renderQuestionTypeIcon(question.question_type)}
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {question.question_type}
                          </span>
                          {question.is_required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {question.question_text}
                      </h3>
                      {question.placeholder_text && (
                        <p className="text-sm text-gray-500">
                          Placeholder: {question.placeholder_text}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteQuestionClick(question)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Question"
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'view' ? 'Response Details' : 
                 modalMode === 'reply' ? 'Send Reply' : 'Add Questions'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'view' && selectedResponse && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiUser className="w-5 h-5 mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {selectedResponse.full_name}</div>
                      <div><strong>Email:</strong> {selectedResponse.email}</div>
                      <div><strong>Phone:</strong> {selectedResponse.phone}</div>
                      <div><strong>Submitted:</strong> {ScreeningService.formatDate(selectedResponse.created_at)}</div>
                    </div>
                    {selectedResponse.message && (
                      <div className="mt-4">
                        <strong>Message:</strong>
                        <p className="mt-1 text-gray-700">{selectedResponse.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Answers */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Answers</h3>
                    {selectedResponse.answers.map((answer, index) => (
                      <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {answer.question_text}
                            </h4>
                            <div className="flex items-center space-x-2 mb-2">
                              {renderQuestionTypeIcon(answer.question_type)}
                              <span className="text-xs text-gray-500 uppercase">
                                {answer.question_type}
                              </span>
                            </div>
                            <p className="text-gray-700 font-medium">
                              {ScreeningService.formatAnswerValue(answer)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin Reply */}
                  {selectedResponse.admin_reply && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Reply</h3>
                      <p className="text-sm text-blue-800 mb-2">{selectedResponse.admin_reply}</p>
                      {selectedResponse.replied_at && (
                        <p className="text-xs text-blue-600">
                          Replied on: {ScreeningService.formatDate(selectedResponse.replied_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {modalMode === 'reply' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={replyForm.reply_message}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, reply_message: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your reply to the applicant..."
                    />
                  </div>
                </div>
              )}

              {modalMode === 'questions' && (
                <div className="space-y-6">
                  {questionForm.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        {questionForm.questions.length > 1 && (
                          <button
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={question.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter the question text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                          <select
                            value={question.question_type}
                            onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="yesno">Yes/No</option>
                          </select>
                        </div>
                        
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                          <input
                            type="number"
                            value={question.order}
                            onChange={(e) => updateQuestion(index, 'order', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div> */}
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
                          <input
                            type="text"
                            value={question.placeholder_text}
                            onChange={(e) => updateQuestion(index, 'placeholder_text', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Placeholder text for the input field"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={question.is_required}
                              onChange={(e) => updateQuestion(index, 'is_required', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Required</span>
                          </label>
                          
                          {/* <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={question.is_active}
                              onChange={(e) => updateQuestion(index, 'is_active', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addQuestion}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Another Question</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {modalMode === 'reply' && (
                <button
                  onClick={handleSubmitReply}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              )}
              {modalMode === 'questions' && (
                <button
                  onClick={handleCreateQuestions}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-4 h-4" />
                      <span>Create Questions</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmModal.itemType === 'response' ? 'Response' : 'Question'}`}
        message={`Are you sure you want to delete ${confirmModal.itemType === 'response' ? 'the response from' : 'the question:'} "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
};

export default ScreeningManagement;