import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, Eye, MessageSquare, Check, Calendar, Clock, LogIn, AlertTriangle } from 'lucide-react'
import { useToast } from '../components/ToastProvider'
import { Editor } from '@tinymce/tinymce-react'
import useQuestionStore from '../store/questionStore'
import useAuthStore from '../store/authStore'
import { formatHtmlContent } from '../utils/formatUtils'
import Prism from 'prismjs'
import Confirm from '../components/Confirm'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'

const QuestionDetail = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [loginConfirm, setLoginConfirm] = useState({ show: false, action: '' })
  const navigate = useNavigate()

  const { getQuestion, upvoteQuestion, downvoteQuestion, createAnswer } = useQuestionStore()
  const { user } = useAuthStore()
  const toast = useToast()



  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const result = await getQuestion(id)
        if (result.success) {
          setQuestion(result.data)
          setAnswers(result.data.answers || [])
          setIsError(false)
        } else {
          setIsError(true)
          toast.error(result.error || 'Question not found')
        }
      } catch (error) {
        console.error('Error fetching question:', error)
        setIsError(true)
        toast.error('Failed to load question. Please try again later.')
      } finally {
        setIsLoaded(true)
      }
    }

    fetchQuestion()
  }, [id, getQuestion, toast])

  useEffect(() => {
    // Highlight code blocks after content loads
    if (isLoaded) {
      setTimeout(() => {
        try {
          Prism.highlightAll()
        } catch (error) {
          console.error('Error highlighting code:', error)
        }
      }, 200) // Slightly longer delay to ensure DOM is fully updated
    }
  }, [question, answers, isLoaded])

  const formatContent = (content) => {
    // If content is already HTML (from TinyMCE), return it directly
    if (content && (content.includes('<p>') || content.includes('<h1>') || content.includes('<ul>') || content.includes('<pre>'))) {
      return formatHtmlContent(content);
    }

    // Otherwise, convert markdown-style code blocks to HTML with Prism classes
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript'
        return `<pre class="language-${language}"><code class="language-${language}">${code.trim()}</code></pre>`
      })
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\n/g, '<br>')
  }

  const handleVote = async (type, targetType, targetId) => {
    if (!user) {
      setLoginConfirm({ show: true, action: 'vote' })
      return
    }

    try {
      if (targetType === 'question') {
        if (type === 'up') {
          await upvoteQuestion(targetId)
        } else {
          await downvoteQuestion(targetId)
        }
        // Refresh question data
        const result = await getQuestion(id)
        if (result.success) {
          setQuestion(result.data)
          toast.success(type === 'up' ? 'Upvoted successfully!' : 'Downvoted successfully!')
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to register your vote. Please try again.')
    }
  }

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return
    if (!user) {
      setLoginConfirm({ show: true, action: 'answer' })
      return
    }

    try {
      const result = await createAnswer(id, newAnswer)
      if (result.success) {
        setNewAnswer('')
        // Refresh question data to get updated answers
        const updatedResult = await getQuestion(id)
        if (updatedResult.success) {
          setQuestion(updatedResult.data)
          setAnswers(updatedResult.data.answers || [])
        }
        toast.success('Your answer has been posted successfully!')
      } else {
        toast.error(result.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('Failed to submit answer. Please try again.')
    }
  }

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
  
  if (isError || !question) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
      <div className="bg-[#1C1C1E] rounded-lg p-8 max-w-md text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Question Not Found</h2>
        <p className="text-[#8E8E93] mb-6">The question you're looking for doesn't exist or couldn't be loaded.</p>
        <button 
          onClick={() => navigate('/questions')} 
          className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Questions
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-4 md:pt-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

          {/* Breadcrumb */}
          <div className="mb-4">
            <Link to="/questions" className="text-[#007AFF] hover:underline">
              ← Back to Questions
            </Link>
          </div>

          {/* Question Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {question.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8E8E93] mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Asked {question.askedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Modified {question.modifiedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Viewed {question.views} times</span>
              </div>
            </div>

            <hr className="border-[#2C2C2E]" />
          </div>

          {/* Question Content */}
          <div className="flex gap-6 mb-8">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <button
                onClick={() => handleVote('up', 'question', question.id)}
                className="p-3 rounded-full hover:bg-[#2C2C2E] transition-colors group"
              >
                <ChevronUp className="w-10 h-10 text-[#8E8E93] group-hover:text-[#34C759]" />
              </button>

              <span className="text-3xl font-bold text-white">
                {typeof question.votes === 'object' && question.votes !== null
                  ? (question.votes.upvotes?.length || 0) - (question.votes.downvotes?.length || 0)
                  : question.votes || 0}
              </span>

              <button
                onClick={() => handleVote('down', 'question', question.id)}
                className="p-3 rounded-full hover:bg-[#2C2C2E] transition-colors group"
              >
                <ChevronDown className="w-10 h-10 text-[#8E8E93] group-hover:text-[#FF3B30]" />
              </button>
            </div>

            {/* Question Description */}
            <div className="flex-1">
              <div className="bg-[#1C1C1E] rounded-lg p-6 mb-4">
                <div
                  className="content-container text-white leading-relaxed code-highlight"
                  dangerouslySetInnerHTML={{ __html: formatContent(question.description) }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-[#2C2C2E] text-[#8E8E93] px-3 py-1 rounded text-sm hover:bg-[#3C3C3E] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex justify-end">
                <div className="bg-[#1C1C1E] rounded-lg p-3 text-sm">
                  <div className="text-[#8E8E93] mb-1">
                    asked {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : question.askedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {question.authorAvatar}
                    </div>
                    <Link to={`/user/${question.author?._id || question.authorId}`} className="text-[#007AFF] hover:underline cursor-pointer">
                      {question.author?.name || question.authorName || question.author || 'Anonymous'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-[#007AFF] w-5 h-5" />
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>

            {answers.map((answer, index) => (
              <div key={answer._id || answer.id || index} className={`flex gap-6 mb-6 ${index !== answers.length - 1 ? 'border-b border-[#2C2C2E] pb-6' : ''}`}>
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <button
                    onClick={() => handleVote('up', 'answer', answer.id)}
                    className="p-2 rounded-full hover:bg-[#2C2C2E] transition-colors group"
                  >
                    <ChevronUp className="w-8 h-8 text-[#8E8E93] group-hover:text-[#34C759]" />
                  </button>

                  <span className="text-2xl font-bold text-white">
                    {typeof answer.votes === 'object' && answer.votes !== null
                      ? (answer.votes.upvotes?.length || 0) - (answer.votes.downvotes?.length || 0)
                      : answer.votes || 0}
                  </span>

                  <button
                    onClick={() => handleVote('down', 'answer', answer.id)}
                    className="p-2 rounded-full hover:bg-[#2C2C2E] transition-colors group"
                  >
                    <ChevronDown className="w-8 h-8 text-[#8E8E93] group-hover:text-[#FF3B30]" />
                  </button>

                  {answer.isAccepted && (
                    <Check className="w-8 h-8 text-[#34C759] mt-2" />
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="bg-[#1C1C1E] rounded-lg p-6 mb-4">
                    <div
                      className="content-container text-white leading-relaxed code-highlight"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                  </div>

                  {/* Answer Author Info */}
                  <div className="flex justify-end">
                    <div className="bg-[#1C1C1E] rounded-lg p-3 text-sm">
                      <div className="text-[#8E8E93] mb-1">
                        answered {answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : 'recently'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {answer.author?.name?.charAt(0).toUpperCase() || answer.authorAvatar || 'A'}
                        </div>
                        <Link to={`/user/${answer.author?._id || answer.authorId}`} className="text-[#007AFF] hover:underline cursor-pointer">
                          {answer.author?.name || answer.authorName || 'Anonymous'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Answer Form */}
          <div className="bg-[#1C1C1E] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Answer</h3>

            {user ? (
              <>
                <div className="mb-4">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={newAnswer}
                    onEditorChange={(content) => setNewAnswer(content)}
                    init={{
                      height: 300,
                      menubar: false,
                      skin: 'oxide-dark',
                      content_css: 'dark',
                      plugins: ['link', 'lists', 'emoticons', 'charmap', 'codesample'],
                      toolbar: 'blocks | bold italic strikethrough | link | numlist bullist | emoticons charmap | codesample',
                      block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
                      content_style: `
                        body { 
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif; 
                          font-size: 14px; 
                          background-color: #1C1C1E; 
                          color: #ffffff; 
                          line-height: 1.6;
                        }
                        h1 { 
                          font-size: 1.875rem; 
                          font-weight: 700; 
                          color: #FF6B35; 
                          margin-top: 1.5rem; 
                          margin-bottom: 1rem; 
                        }
                        h2 { 
                          font-size: 1.5rem; 
                          font-weight: 600; 
                          color: #FF9F0A; 
                          margin-top: 1.25rem; 
                          margin-bottom: 0.75rem; 
                        }
                        h3 { 
                          font-size: 1.25rem; 
                          font-weight: 500; 
                          color: #5AC8FA; 
                          margin-top: 1rem; 
                          margin-bottom: 0.5rem; 
                        }
                        p { 
                          margin-top: 1rem; 
                          margin-bottom: 1rem; 
                        }
                        ul { 
                          list-style-type: disc; 
                          padding-left: 1.25rem; 
                          margin-top: 1rem; 
                          margin-bottom: 1rem; 
                        }
                        ol { 
                          list-style-type: decimal; 
                          padding-left: 1.25rem; 
                          margin-top: 1rem; 
                          margin-bottom: 1rem; 
                        }
                        li { 
                          margin-top: 0.25rem; 
                          margin-bottom: 0.25rem; 
                        }
                        pre { 
                          background-color: #2C2C2E; 
                          border: 1px solid #3A3A3C; 
                          border-radius: 0.375rem; 
                          padding: 1rem; 
                          margin-top: 1rem; 
                          margin-bottom: 1rem; 
                          overflow-x: auto; 
                        }
                        code { 
                          background-color: #2C2C2E; 
                          color: #FF9F0A; 
                          padding: 0.125rem 0.375rem; 
                          border-radius: 0.25rem; 
                          font-family: monospace; 
                        } { font-size: 1.5em; }
                        h3 { font-size: 1.2em; }
                        pre { 
                          background-color: #2C2C2E; 
                          padding: 12px; 
                          border-radius: 6px; 
                          border: 1px solid #3A3A3C;
                          overflow-x: auto;
                        }
                        code {
                          background-color: #2C2C2E;
                          padding: 2px 4px;
                          border-radius: 3px;
                          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        }
                        ul, ol { 
                          padding-left: 1.5em; 
                        }
                        a { 
                          color: #007AFF; 
                        }
                      `
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim()}
                  className="bg-[#007AFF] hover:bg-[#0056CC] disabled:bg-[#2C2C2E] disabled:text-[#8E8E93] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Post Your Answer
                </button>
              </>
            ) : (
              <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg p-6 text-center">
                <div className="mb-4">
                  <MessageSquare className="w-12 h-12 text-[#8E8E93] mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Want to answer this question?</h4>
                  <p className="text-[#8E8E93] text-sm mb-4">
                    Sign in to share your knowledge and help the community by providing a detailed answer.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/login"
                    className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-lg font-medium transition-colors no-underline"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-transparent border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors no-underline"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Confirmation */}
      <Confirm
        isOpen={loginConfirm.show}
        onClose={() => setLoginConfirm({ ...loginConfirm, show: false })}
        onConfirm={() => {
          setLoginConfirm({ ...loginConfirm, show: false })
          window.location.href = '/login'
        }}
        title="Sign In Required"
        type="info"
        message={`Please sign in to ${loginConfirm.action === 'vote' ? 'vote on questions and answers' : 'post an answer'}.`}
        confirmText="Sign In"
        cancelText="Cancel"
      />
    </div>
  )
}

export default QuestionDetail