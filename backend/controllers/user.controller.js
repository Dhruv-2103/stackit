import User from '../model/user.model.js';
import Question from '../model/question.model.js';
import Answer from '../model/answer.model.js';

// GET /users/:id/stats
export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Count questions asked by the user
    const questionsCount = await Question.countDocuments({ author: id });
    
    // Count answers posted by the user
    const answersCount = await Answer.countDocuments({ author: id });
    
    // Get upvoted and downvoted counts
    const upvotedCount = user.upvotedQuestions.length + user.upvotedAnswers.length;
    const downvotedCount = user.downvotedQuestions.length + user.downvotedAnswers.length;
    
    res.json({
      questionsCount,
      answersCount,
      upvotedCount,
      downvotedCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting user statistics' });
  }
};