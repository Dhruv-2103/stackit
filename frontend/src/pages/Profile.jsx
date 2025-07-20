import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MessageSquare, Eye, ChevronUp, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useQuestionStore from '../store/questionStore'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuthStore()
  const { questions, getQuestions } = useQuestionStore()
  const [userQuestions, setUserQuestions] = useState([])
  const [userStats, setUserStats] = useState({
    questionsCount: 0,
    answersCount: 0,
    upvotedCount: 0,
    downvotedCount: 0
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        await getQuestions()

        try {
          const response = await axios.get(`http://localhost:5000/api/users/${user._id}/stats`)
          if (response.data) {
            setUserStats(response.data)
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        }
      }
      setIsLoaded(true)
    }
    fetchUserData()
  }, [user, getQuestions])

  useEffect(() => {
    if (questions && user) {
      const filteredQuestions = questions.filter(q =>
        q.author?._id === user._id || q.author === user._id
      )
      setUserQuestions(filteredQuestions)
    }
  }, [questions, user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please log in to view your profile</div>
          <Link to="/login" className="text-[#007AFF] hover:underline">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-4 md:pt-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Profile Header */}
        <div className="bg-[#1C1C1E] rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-orange rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{user.name || 'Anonymous'}</h1>
              <p className="text-[#8E8E93] mb-2">{user.email}</p>
              <div className="flex items-center gap-4 text-sm text-[#8E8E93]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2C2C2E] rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-[#007AFF]" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats.questionsCount}</div>
              <div className="text-xs text-[#8E8E93]">Questions Asked</div>
            </div>

            <div className="bg-[#2C2C2E] rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-[#34C759]" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats.answersCount}</div>
              <div className="text-xs text-[#8E8E93]">Answers Posted</div>
            </div>

            <div className="bg-[#2C2C2E] rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <ThumbsUp className="w-6 h-6 text-[#34C759]" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats.upvotedCount}</div>
              <div className="text-xs text-[#8E8E93]">Upvotes Given</div>
            </div>

            <div className="bg-[#2C2C2E] rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <ThumbsDown className="w-6 h-6 text-[#FF3B30]" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{userStats.downvotedCount}</div>
              <div className="text-xs text-[#8E8E93]">Downvotes Given</div>
            </div>
          </div>
        </div>

        {/* User Questions */}
        <div className="bg-[#1C1C1E] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="text-[#007AFF] w-5 h-5" />
            My Questions ({userQuestions.length})
          </h2>

          {isLoaded ? (
            userQuestions.length > 0 ? (
              <div className="space-y-4">
                {userQuestions.map((question) => (
                  <div key={question._id} className="bg-[#2C2C2E] rounded-lg p-4 hover:bg-[#3C3C3E] transition-colors">
                    <Link
                      to={`/questions/${question._id}`}
                      className="text-[#007AFF] font-semibold text-lg hover:underline block mb-2"
                    >
                      {question.title}
                    </Link>

                    <p className="text-[#8E8E93] text-sm mb-3 line-clamp-2">
                      {question.description?.substring(0, 150)}...
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#8E8E93]">
                      <div className="flex items-center gap-1">
                        <ChevronUp className="w-3 h-3" />
                        <span>{(question.votes?.upvotes?.length || 0) - (question.votes?.downvotes?.length || 0)} votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{question.answers?.length || 0} answers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{question.views || 0} views</span>
                      </div>
                      <span>Asked {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.tags?.map(tag => (
                        <span
                          key={tag}
                          className="bg-[#1C1C1E] text-[#8E8E93] px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-[#8E8E93] mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No questions yet</h3>
                <p className="text-[#8E8E93] text-sm mb-4">
                  You haven't asked any questions yet. Start by asking your first question!
                </p>
                <Link
                  to="/questions"
                  className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ask Your First Question
                </Link>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="text-[#8E8E93]">Loading your questions...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile