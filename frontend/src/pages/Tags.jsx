import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { updateMetaTags, addStructuredData } from '../utils/seo';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTags();
    
    updateMetaTags({
      title: 'Browse Tags - StackIT | Find Questions by Topic',
      description: 'Explore programming topics and tags on StackIT. Find questions about React, JavaScript, Node.js, MongoDB, Python, and more. Filter by your favorite technologies.',
      keywords: 'programming tags, technology topics, React questions, JavaScript help, Node.js, MongoDB, Python, web development topics',
      canonical: `${window.location.origin}/tags`
    });

    addStructuredData({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Programming Tags",
      "description": "Browse questions by programming language and technology tags",
      "url": `${window.location.origin}/tags`
    });
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/quesans/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">Loading tags...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tags</h1>
          <p className="text-[#8E8E93] mb-6">
            Browse questions by tags to find topics you're interested in.
          </p>
          
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2C2C2E] text-white placeholder-[#8E8E93] border border-[#3A3A3C] rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/questions?tag=${encodeURIComponent(tag.name)}`}
              className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg p-4 hover:border-[#FF6B35] hover:bg-[#2C2C2E] transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-[#FF6B35] text-white text-xs px-2 py-1 rounded font-medium">
                  {tag.name}
                </span>
                <span className="text-[#8E8E93] text-sm">
                  {tag.count} question{tag.count !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[#8E8E93] text-sm group-hover:text-white transition-colors">
                Click to view all questions tagged with "{tag.name}"
              </p>
            </Link>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#8E8E93] mb-4">
              {searchTerm ? 'No tags found matching your search.' : 'No tags available yet.'}
            </div>
            {!searchTerm && (
              <Link
                to="/questions"
                className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#E55A2B] transition-colors"
              >
                Ask the First Question
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;