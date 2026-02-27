import { User } from '../data/mockData';

export interface FeedbackRating {
  overallScore: number;
  categories: {
    technicalSkills: number;
    collaboration: number;
    leadership: number;
    innovation: number;
    communication: number;
  };
  strengths: string[];
  improvements: string[];
  achievements: string[];
  recommendations: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  nextMilestone: string;
}

export interface FeedbackHistory {
  id: string;
  userId: string;
  rating: FeedbackRating;
  date: string;
  type: 'self-assessment' | 'peer-review' | 'ai-analysis';
}

export class FeedbackService {
  // Calculate user rating based on skills, achievements, and activity
  static calculateUserRating(user: User): FeedbackRating {
    // Base scores from skills (more skills = higher technical score)
    const technicalSkillsScore = Math.min(100, user.skills.length * 15);
    
    // Collaboration score based on connections and projects
    const collaborationScore = Math.min(100, (user.badges?.length || 0) * 20 + 30);
    
    // Leadership score based on badges and role
    const leadershipScore = user.role === 'mentor' ? 85 : Math.min(100, (user.badges?.length || 0) * 15 + 40);
    
    // Innovation score based on unique skills and interests
    const uniqueSkills = new Set([...user.skills, ...user.interests]).size;
    const innovationScore = Math.min(100, uniqueSkills * 12);
    
    // Communication score (simulated based on profile completeness)
    const communicationScore = user.bio ? 80 : 60;
    
    // Calculate overall score
    const overallScore = Math.round(
      (technicalSkillsScore + collaborationScore + leadershipScore + innovationScore + communicationScore) / 5
    );

    // Determine level
    let level: FeedbackRating['level'];
    if (overallScore >= 90) level = 'Expert';
    else if (overallScore >= 75) level = 'Advanced';
    else if (overallScore >= 60) level = 'Intermediate';
    else level = 'Beginner';

    // Generate strengths based on high-scoring categories
    const strengths: string[] = [];
    if (technicalSkillsScore >= 80) strengths.push('Strong technical foundation with diverse skill set');
    if (collaborationScore >= 80) strengths.push('Excellent team player and collaborator');
    if (leadershipScore >= 80) strengths.push('Natural leadership abilities');
    if (innovationScore >= 80) strengths.push('Innovative thinker with creative problem-solving skills');
    if (communicationScore >= 80) strengths.push('Clear and effective communicator');

    // Generate improvements based on lower-scoring categories
    const improvements: string[] = [];
    if (technicalSkillsScore < 70) improvements.push('Expand technical skill set through courses and practice');
    if (collaborationScore < 70) improvements.push('Increase participation in team projects and collaborations');
    if (leadershipScore < 70) improvements.push('Take on leadership roles in group activities');
    if (innovationScore < 70) improvements.push('Explore creative approaches to problem-solving');
    if (communicationScore < 70) improvements.push('Work on presentation and communication skills');

    // Generate achievements based on badges and skills
    const achievements: string[] = [];
    if (user.badges) {
      achievements.push(`Earned ${user.badges.length} achievement badges`);
    }
    if (user.skills.length >= 5) {
      achievements.push(`Mastered ${user.skills.length} technical skills`);
    }
    if (user.interests.length >= 3) {
      achievements.push(`Active in ${user.interests.length} interest areas`);
    }
    if (user.role === 'mentor') {
      achievements.push('Recognized as a mentor in the community');
    }

    // Generate personalized recommendations
    const recommendations: string[] = [];
    if (technicalSkillsScore < 85) {
      recommendations.push(`Focus on learning ${user.skills.length > 0 ? user.skills[0] : 'a new technology'} to boost technical skills`);
    }
    if (collaborationScore < 85) {
      recommendations.push('Join more team projects to enhance collaboration experience');
    }
    if (leadershipScore < 85 && user.role !== 'mentor') {
      recommendations.push('Consider mentoring junior students to develop leadership skills');
    }
    if (innovationScore < 85) {
      recommendations.push('Participate in hackathons and innovation challenges');
    }
    recommendations.push('Maintain consistent activity on the platform to build your reputation');

    // Determine next milestone
    let nextMilestone: string;
    if (level === 'Beginner') {
      nextMilestone = 'Reach Intermediate level by expanding your skill set and participating in 3+ projects';
    } else if (level === 'Intermediate') {
      nextMilestone = 'Reach Advanced level by mentoring others and leading a project team';
    } else if (level === 'Advanced') {
      nextMilestone = 'Reach Expert level by organizing events and publishing technical content';
    } else {
      nextMilestone = 'Maintain Expert status by continuing to innovate and lead in the community';
    }

    return {
      overallScore,
      categories: {
        technicalSkills: technicalSkillsScore,
        collaboration: collaborationScore,
        leadership: leadershipScore,
        innovation: innovationScore,
        communication: communicationScore
      },
      strengths,
      improvements,
      achievements,
      recommendations,
      level,
      nextMilestone
    };
  }

  // Generate AI feedback based on user data
  static generateAIFeedback(user: User): FeedbackRating {
    // Add some AI "magic" to make it feel more intelligent
    const baseRating = this.calculateUserRating(user);
    
    // AI-enhanced insights based on patterns
    const aiInsights = this.analyzePatterns(user);
    
    return {
      ...baseRating,
      strengths: [...baseRating.strengths, ...aiInsights.strengths],
      improvements: [...baseRating.improvements, ...aiInsights.improvements],
      recommendations: [...baseRating.recommendations, ...aiInsights.recommendations]
    };
  }

  // Analyze user patterns for AI insights
  private static analyzePatterns(user: User) {
    const insights = {
      strengths: [] as string[],
      improvements: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze skill patterns
    const techSkills = user.skills.filter(skill => 
      ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript'].includes(skill)
    );
    if (techSkills.length >= 3) {
      insights.strengths.push('Strong foundation in modern web technologies');
    }

    // Analyze interest-skill alignment
    const alignedInterests = user.interests.filter(interest =>
      user.skills.some(skill => skill.toLowerCase().includes(interest.toLowerCase()) ||
                           interest.toLowerCase().includes(skill.toLowerCase()))
    );
    if (alignedInterests.length >= 2) {
      insights.strengths.push('Excellent alignment between interests and skills');
    } else if (alignedInterests.length === 0) {
      insights.recommendations.push('Consider developing skills that align with your interests');
    }

    // Analyze badge patterns
    if (user.badges?.includes('Hackathon Pro')) {
      insights.strengths.push('Proven ability to perform under pressure');
      insights.recommendations.push('Leverage hackathon experience in real-world projects');
    }

    if (user.badges?.includes('Top Contributor')) {
      insights.strengths.push('Consistent and valuable contributor to the community');
      insights.recommendations.push('Consider taking on mentoring roles');
    }

    return insights;
  }

  // Save feedback to localStorage
  static saveFeedback(userId: string, feedback: FeedbackRating, type: FeedbackHistory['type'] = 'ai-analysis') {
    const history = this.getFeedbackHistory(userId);
    const newEntry: FeedbackHistory = {
      id: `feedback_${Date.now()}`,
      userId,
      rating: feedback,
      date: new Date().toISOString(),
      type
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10 feedbacks
    localStorage.setItem(`simply_connect_feedback_${userId}`, JSON.stringify(updatedHistory));
  }

  // Get feedback history
  static getFeedbackHistory(userId: string): FeedbackHistory[] {
    const saved = localStorage.getItem(`simply_connect_feedback_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  // Get peer feedback (mock implementation)
  static getPeerFeedback(userId: string): FeedbackRating {
    // Simulate peer review with slightly different scores
    const mockUser: User = {
      id: userId,
      name: 'Peer Review',
      email: 'peer@example.com',
      role: 'student',
      avatar: '',
      bio: 'Peer review feedback',
      skills: ['Communication', 'Teamwork'],
      interests: ['Collaboration'],
      branch: 'Computer Science',
      year: 3,
      compatibility: 85,
      badges: ['Team Player']
    };

    const peerRating = this.calculateUserRating(mockUser);
    
    // Adjust scores to simulate peer perspective
    return {
      ...peerRating,
      overallScore: Math.max(60, Math.min(95, peerRating.overallScore + (Math.random() * 20 - 10))),
      categories: {
        technicalSkills: Math.max(60, Math.min(95, peerRating.categories.technicalSkills + (Math.random() * 20 - 10))),
        collaboration: Math.max(60, Math.min(95, peerRating.categories.collaboration + (Math.random() * 20 - 10))),
        leadership: Math.max(60, Math.min(95, peerRating.categories.leadership + (Math.random() * 20 - 10))),
        innovation: Math.max(60, Math.min(95, peerRating.categories.innovation + (Math.random() * 20 - 10))),
        communication: Math.max(60, Math.min(95, peerRating.categories.communication + (Math.random() * 20 - 10)))
      }
    };
  }
}
