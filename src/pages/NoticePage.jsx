import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBell,
  FiCalendar,
  FiEye,
  FiDownload,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import toast from "react-hot-toast";
import NoticeService from "../services/noticeService";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [pagination.offset, searchTerm]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await NoticeService.getActiveNotices({
        limit: pagination.limit,
        offset: pagination.offset,
        search: searchTerm || undefined,
      });

      if (response.success) {
        setNotices(response.data.notices);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          hasNext:
            response.data.pagination.total >
            pagination.offset + pagination.limit,
          hasPrev: pagination.offset > 0,
        }));
      } else {
        toast.error(response.message);
        setNotices([]);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      setPagination((prev) => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit),
      }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const openNoticeModal = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const closeNoticeModal = () => {
    setSelectedNotice(null);
    setShowModal(false);
  };

  const handleDownload = async (notice) => {
    if (notice.original_filename) {
      toast.loading("Preparing download...", { id: "downloadToast" });
      const response = await NoticeService.downloadNoticeFile(notice.id, false); // false for public
    //   console.log(response.data);

      if (response.success) {
        toast.dismiss("downloadToast");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const getFileIcon = (filename) => {
    if (NoticeService.isImageFile(filename)) {
      return <FiImage className="w-4 h-4" />;
    } else if (NoticeService.isDocumentFile(filename)) {
      return <FiFileText className="w-4 h-4" />;
    }
    return <FiFileText className="w-4 h-4" />;
  };

  // Loading skeleton component
  const NoticeSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="w-3/4 h-6 bg-gray-200 rounded mb-3"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="w-20 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiBell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
                  <p className="text-gray-600">
                    Important announcements and updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                >
                  Search
                </button>
              </form>
            </div>

            {!loading && (
              <div className="text-sm text-gray-600">
                {pagination.total > 0 ? (
                  <>
                    Showing {pagination.offset + 1}-
                    {Math.min(
                      pagination.offset + pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} notices
                  </>
                ) : (
                  "No notices found"
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <NoticeSkeleton key={index} />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notices available
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No notices found matching "${searchTerm}"`
                : "There are no active notices at the moment."}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPagination((prev) => ({ ...prev, offset: 0 }));
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {notice.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {NoticeService.formatDate(notice.created_at)}
                        </div>
                        {notice.original_filename && (
                          <div className="flex items-center">
                            {getFileIcon(notice.original_filename)}
                            <span className="ml-1">Attachment</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  {notice.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-3">
                        {notice.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {notice.original_filename && (
                        <button
                          onClick={() => handleDownload(notice)}
                          className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <FiDownload className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => openNoticeModal(notice)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrev}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {Math.floor(pagination.offset / pagination.limit) + 1} of{" "}
                  {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <FiChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notice Detail Modal */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Notice Details
                </h2>
                <button
                  onClick={closeNoticeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {NoticeService.formatDate(selectedNotice.created_at)}
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              {selectedNotice.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Description
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedNotice.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedNotice.original_filename && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Attachment
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(selectedNotice.original_filename)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedNotice.original_filename}
                        </p>
                        <p className="text-xs text-gray-600">
                          {selectedNotice.file_type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedNotice)}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p>
                  Last updated:{" "}
                  {NoticeService.formatDate(selectedNotice.updated_at)}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeNoticeModal}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticePage;
