import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Trash2, Ban, Shield, AlertTriangle, Tags, Plus } from 'lucide-react';
import useAdminStore from '../store/adminStore';
import useAuthStore from '../store/authStore';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [showDeleteTagModal, setShowDeleteTagModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState('');
  const [showBanUserModal, setShowBanUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [userToAction, setUserToAction] = useState({ id: '', name: '', isBanned: false });
  const [questionToDelete, setQuestionToDelete] = useState({ id: '', title: '' });
  const { users, questions, getAllUsers, getAllQuestions, toggleBanUser, deleteUser, deleteQuestion, deleteAnswer, getTags, addTag, deleteTag, isLoading, error } = useAdminStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      getAllUsers();
      getAllQuestions();
      loadTags();
    }
  }, [user]);

  const loadTags = async () => {
    const result = await getTags();
    if (result.success) {
      setTags(result.data);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-[#8E8E93]">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleBanUser = (userId, userName, isBanned) => {
    setUserToAction({ id: userId, name: userName, isBanned });
    setShowBanUserModal(true);
  };

  const confirmBanUser = async () => {
    const result = await toggleBanUser(userToAction.id);
    if (!result.success) {
      alert(result.error);
    }
    setShowBanUserModal(false);
  };

  const handleDeleteUser = (userId, userName) => {
    setUserToAction({ id: userId, name: userName });
    setShowDeleteUserModal(true);
  };

  const confirmDeleteUser = async () => {
    const result = await deleteUser(userToAction.id);
    if (!result.success) {
      alert(result.error);
    }
    setShowDeleteUserModal(false);
  };

  const handleDeleteQuestion = (questionId, questionTitle) => {
    setQuestionToDelete({ id: questionId, title: questionTitle });
    setShowDeleteQuestionModal(true);
  };

  const confirmDeleteQuestion = async () => {
    const result = await deleteQuestion(questionToDelete.id);
    if (!result.success) {
      alert(result.error);
    }
    setShowDeleteQuestionModal(false);
  };

  const handleDeleteAnswer = async (answerId) => {
    const result = await deleteAnswer(answerId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    const result = await addTag(newTagName.trim());
    if (result.success) {
      setNewTagName('');
      loadTags();
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  const handleDeleteTag = (tagName) => {
    setTagToDelete(tagName);
    setShowDeleteTagModal(true);
  };

  const confirmDeleteTag = async () => {
    const result = await deleteTag(tagToDelete);
    if (result.success) {
      loadTags();
      getAllQuestions(); // Refresh questions to show updated tags
      alert(result.message);
    } else {
      alert(result.error);
    }
    setShowDeleteTagModal(false);
    setTagToDelete('');
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-[#8E8E93]">Manage users, questions, and answers</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'questions'
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tags'
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Tags className="w-4 h-4" />
            Tags ({tags.length})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#1C1C1E] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2C2C2E]">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">Name</th>
                    <th className="text-left p-4 text-white font-semibold">Email</th>
                    <th className="text-left p-4 text-white font-semibold">Role</th>
                    <th className="text-left p-4 text-white font-semibold">Status</th>
                    <th className="text-left p-4 text-white font-semibold">Joined</th>
                    <th className="text-left p-4 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-[#2C2C2E]">
                      <td className="p-4 text-white">{user.name}</td>
                      <td className="p-4 text-[#8E8E93]">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.isBanned 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-[#8E8E93]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {user.role !== 'admin' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBanUser(user._id, user.name, user.isBanned)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isBanned
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                              title={user.isBanned ? 'Unban User' : 'Ban User'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="bg-[#1C1C1E] rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Tag</h3>
              <form onSubmit={handleAddTag} className="flex gap-3">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="flex-1 bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-2 focus:outline-none focus:border-[#007AFF]"
                />
                <button
                  type="submit"
                  className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Existing Tags ({tags.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tags.map((tag) => (
                  <div key={tag} className="bg-[#2C2C2E] rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white">{tag}</span>
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete Tag"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-[#8E8E93] text-center py-8">No tags found. Tags will appear here when users create questions.</p>
              )}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id} className="bg-[#1C1C1E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{question.title}</h3>
                    <p className="text-[#8E8E93] text-sm mb-2">
                      By {question.author?.name} • {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag) => (
                        <span key={tag} className="bg-[#2C2C2E] text-[#8E8E93] px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question._id, question.title)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Answers */}
                {question.answers && question.answers.length > 0 && (
                  <div className="border-t border-[#2C2C2E] pt-4">
                    <h4 className="text-white font-medium mb-3">Answers ({question.answers.length})</h4>
                    <div className="space-y-3">
                      {question.answers.map((answer) => (
                        <div key={answer._id} className="bg-[#2C2C2E] rounded-lg p-4 flex justify-between items-start">
                          <div className="flex-1">
                            <div 
                              className="text-[#8E8E93] text-sm mb-2 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: answer.content.substring(0, 200) + '...' }}
                            />
                            <p className="text-xs text-[#8E8E93]">
                              By {answer.author?.name} • {new Date(answer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAnswer(answer._id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors ml-4"
                            title="Delete Answer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-pulse text-[#8E8E93]">Loading...</div>
          </div>
        )}

        {/* Delete Tag Confirmation Modal */}
        {showDeleteTagModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Tag</h3>
              </div>
              
              <p className="text-[#8E8E93] mb-6">
                The tag <span className="text-white font-medium">"{tagToDelete}"</span> will be permanently deleted from all questions. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteTagModal(false)}
                  className="flex-1 bg-[#2C2C2E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTag}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ban/Unban User Modal */}
        {showBanUserModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userToAction.isBanned ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Ban className={`w-5 h-5 ${
                    userToAction.isBanned ? 'text-green-400' : 'text-yellow-400'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {userToAction.isBanned ? 'Unban User' : 'Ban User'}
                </h3>
              </div>
              
              <p className="text-[#8E8E93] mb-6">
                {userToAction.isBanned 
                  ? `User "${userToAction.name}" will be unbanned and can access the platform again.`
                  : `User "${userToAction.name}" will be banned and cannot access the platform.`
                }
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBanUserModal(false)}
                  className="flex-1 bg-[#2C2C2E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBanUser}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    userToAction.isBanned 
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  {userToAction.isBanned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteUserModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete User</h3>
              </div>
              
              <p className="text-[#8E8E93] mb-6">
                User <span className="text-white font-medium">"{userToAction.name}"</span> and all their data will be permanently deleted. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteUserModal(false)}
                  className="flex-1 bg-[#2C2C2E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Question Modal */}
        {showDeleteQuestionModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Question</h3>
              </div>
              
              <p className="text-[#8E8E93] mb-6">
                Question <span className="text-white font-medium">"{questionToDelete.title}"</span> and all its answers will be permanently deleted. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteQuestionModal(false)}
                  className="flex-1 bg-[#2C2C2E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteQuestion}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;