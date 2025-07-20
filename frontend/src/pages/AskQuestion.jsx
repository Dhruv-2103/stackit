import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowLeft } from 'lucide-react'
import { Editor } from '@tinymce/tinymce-react'
import useQuestionStore from '../store/questionStore'
import useAuthStore from '../store/authStore'
import SEO from '../components/SEO'

const AskQuestion = () => {
  const navigate = useNavigate()
  const { createQuestion, isLoading, error } = useQuestionStore()
  const { user } = useAuthStore()
  
  const [question, setQuestion] = useState({ 
    title: '', 
    description: '', 
    tags: [] 
  })
  const [tagInput, setTagInput] = useState('')

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=ask')
    }
  }, [user, navigate])

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!question.tags.includes(newTag)) {
        setQuestion({
          ...question,
          tags: [...question.tags, newTag]
        })
      }
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tagToRemove) => {
    setQuestion({
      ...question,
      tags: question.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await createQuestion(question.title, question.description, question.tags)
    
    if (result.success) {
      navigate(`/questions/${result.questionId}`)
    }
  }

  if (!user) return null

  return (
    <>
      <SEO 
        title="Ask a Question - StackIT Developer Community"
        description="Ask your programming question and get answers from the StackIT developer community. Share code, explain your problem, and get expert help."
      />
      <div className="min-h-screen bg-[#0C0C0C] pt-4 md:pt-6">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Back button */}
          <button 
            onClick={() => navigate('/questions')}
            className="flex items-center gap-2 text-[#8E8E93] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Questions</span>
          </button>

          <div className="bg-[#1C1C1E] rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6">Ask a Question</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={question.title}
                  onChange={(e) => setQuestion({ ...question, title: e.target.value })}
                  className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                  placeholder="What's your programming question? Be specific."
                  required
                />
                <p className="text-[#8E8E93] text-xs mt-1">
                  Be specific and imagine you're asking a question to another person
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  value={question.description}
                  onEditorChange={(content) => setQuestion({ ...question, description: content })}
                  init={{
                    height: 400,
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
                      h1, h2, h3 { 
                        color: #ffffff; 
                        margin-top: 1.5em; 
                        margin-bottom: 0.5em; 
                      }
                      h1 { font-size: 1.8em; }
                      h2 { font-size: 1.5em; }
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
                <p className="text-[#8E8E93] text-xs mt-1">
                  Include all the information someone would need to answer your question
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {question.tags.map(tag => (
                    <div key={tag} className="bg-[#007AFF] text-white px-2 py-1 rounded-md flex items-center gap-1">
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-[#2C2C2E] text-white border border-[#3A3A3C] rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                  placeholder="Type tag and press Enter (e.g. javascript, react)"
                />
                <p className="text-[#8E8E93] text-xs mt-1">
                  Add up to 5 tags to describe what your question is about
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/questions')}
                  className="px-6 py-3 bg-[#2C2C2E] text-white rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !question.title || !question.description || question.tags.length === 0}
                  className="flex-1 bg-[#007AFF] text-white py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Posting...' : 'Post Your Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AskQuestion