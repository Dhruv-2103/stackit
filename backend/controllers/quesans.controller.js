import Question from '../model/question.model.js';
import Answer from '../model/answer.model.js';
import User from '../model/user.model.js';
import { createNotification } from './notification.controller.js';

// POST /question
export const createQuestion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { title, description, tags } = req.body;
    const question = new Question({
      title,
      description,
      tags,
      author: req.user._id,
    });
    await question.save();
    res.status(201).json({ 
      message: 'Question created successfully',
      questionId: question._id 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating question in createQuestion controller' });
  }
};

// POST /question/:id
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const { title, description, tags } = req.body;
    question.title = title;
    question.description = description;
    question.tags = tags;
    await question.save();
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating question in updateQuestion controller' });
  }
};

// POST /answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const question = await Question.findById(questionId).populate('author');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Get the current user's full details
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    const answer = new Answer({
      question: questionId,
      author: req.user._id,
      content,
    });
    await answer.save();
    question.answers.push(answer._id);
    await question.save();
    
    // Create notification for question author (don't notify if answering own question)
    if (question.author._id.toString() !== currentUser._id.toString()) {
      await createNotification(
        question.author._id,
        currentUser._id,
        'answer',
        `${currentUser.name} answered your question: "${question.title}"`,
        question._id,
        answer._id
      );
    }
    
    res.status(201).json({ message: 'Answer created successfully' });
  } catch (error) {
    console.log('Error in createAnswer:', error);
    res.status(500).json({ message: 'Error creating answer in createAnswer controller' });
  }
};

// POST /answer/:id
export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const { content } = req.body;
    answer.content = content;
    await answer.save();
    res.json({ message: 'Answer updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating answer in updateAnswer controller' });
  }
};

// GET /questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('author').populate('answers');
    res.json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting questions in getQuestions controller' });
  }
};

// GET /questions/:id
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('author').populate('answers');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting question in getQuestion controller' });
  }
};

// GET /answers/:id
export const getAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id).populate('author').populate('question');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    res.json(answer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting answer getAnswer controller' });
  }
};

// PUT /questions/:id/upvote
export const upvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const user = await User.findById(req.user._id);
    
    // Check if already upvoted
    if (user.upvotedQuestions.includes(question._id)) {
      // Remove upvote
      question.votes.upvotes.pull(user._id);
      user.upvotedQuestions.pull(question._id);
    } else {
      // Remove downvote if exists
      if (user.downvotedQuestions.includes(question._id)) {
        question.votes.downvotes.pull(user._id);
        user.downvotedQuestions.pull(question._id);
      }
      // Add upvote
      question.votes.upvotes.push(user._id);
      user.upvotedQuestions.push(question._id);
      
      // Create notification for question author
      await createNotification(
        question.author,
        req.user._id,
        'upvote',
        `${req.user.name} upvoted your question: "${question.title}"`,
        question._id
      );
    }
    
    await question.save();
    await user.save();
    res.json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error upvoting question' });
  }
};


// PUT /questions/:id/downvote
export const downvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const user = await User.findById(req.user._id);
    
    // Check if already downvoted
    if (user.downvotedQuestions.includes(question._id)) {
      // Remove downvote
      question.votes.downvotes.pull(user._id);
      user.downvotedQuestions.pull(question._id);
    } else {
      // Remove upvote if exists
      if (user.upvotedQuestions.includes(question._id)) {
        question.votes.upvotes.pull(user._id);
        user.upvotedQuestions.pull(question._id);
      }
      // Add downvote
      question.votes.downvotes.push(user._id);
      user.downvotedQuestions.push(question._id);
    }
    
    await question.save();
    await user.save();
    res.json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error downvoting question' });
  }
};

// PUT /answers/:id/upvote
export const upvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const user = await User.findById(req.user._id);
    
    // Check if already upvoted
    if (user.upvotedAnswers.includes(answer._id)) {
      // Remove upvote
      answer.votes.upvotes.pull(user._id);
      user.upvotedAnswers.pull(answer._id);
    } else {
      // Remove downvote if exists
      if (user.downvotedAnswers.includes(answer._id)) {
        answer.votes.downvotes.pull(user._id);
        user.downvotedAnswers.pull(answer._id);
      }
      // Add upvote
      answer.votes.upvotes.push(user._id);
      user.upvotedAnswers.push(answer._id);
      
      // Create notification for answer author
      await createNotification(
        answer.author,
        req.user._id,
        'upvote',
        `${req.user.name} upvoted your answer`,
        answer.question,
        answer._id
      );
    }
    
    await answer.save();
    await user.save();
    res.json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error upvoting answer' });
  }
};

// PUT /answers/:id/downvote
export const downvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const user = await User.findById(req.user._id);
    
    // Check if already downvoted
    if (user.downvotedAnswers.includes(answer._id)) {
      // Remove downvote
      answer.votes.downvotes.pull(user._id);
      user.downvotedAnswers.pull(answer._id);
    } else {
      // Remove upvote if exists
      if (user.upvotedAnswers.includes(answer._id)) {
        answer.votes.upvotes.pull(user._id);
        user.upvotedAnswers.pull(answer._id);
      }
      // Add downvote
      answer.votes.downvotes.push(user._id);
      user.downvotedAnswers.push(answer._id);
    }
    
    await answer.save();
    await user.save();
    res.json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error downvoting answer' });
  }
};

// GET /tags
export const getTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};