import { GoogleGenAI, Type } from "@google/genai";

// Mock AI service for development when API key is not available
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const isDevelopment = !process.env.GEMINI_API_KEY;

export const generateAIResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  if (isDevelopment) {
    // Mock response for development
    return "Hi! I'm CampusNet AI. I'm here to help you find teammates, suggest project ideas, and assist with your campus collaboration needs. How can I help you today?";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are CampusNet AI, a helpful assistant for university students. You help them find teammates, suggest project ideas, give career advice, and help with technical questions. Keep responses concise and encouraging.",
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later!";
  }
};

export const generateProjectIdea = async (skills: string[], interests: string[]) => {
  if (isDevelopment) {
    // Mock response for development
    return {
      title: "Campus Event Finder App",
      description: "A mobile app that helps students discover and register for campus events based on their interests and schedule.",
      features: [
        "Personalized event recommendations",
        "Calendar integration",
        "Social networking features"
      ]
    };
  }
  
  try {
    const prompt = `Generate a unique and practical project idea for a university student with the following skills: ${skills.join(', ')} and interests: ${interests.join(', ')}. Provide a title, a short description, and a list of 3 key features.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            features: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "features"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Project Idea Error:", error);
    return null;
  }
};

export const optimizeResume = async (resumeData: any) => {
  if (isDevelopment) {
    // Mock response for development
    return {
      score: 75,
      suggestions: [
        "Add more quantifiable achievements to your experience section",
        "Include relevant technical skills you've gained from projects",
        "Consider adding a summary section at the top of your resume"
      ]
    };
  }
  
  try {
    const prompt = `Analyze the following resume data and provide 3 specific suggestions to improve it for ATS systems and campus placements. Resume Data: ${JSON.stringify(resumeData)}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Optimization score from 0 to 100" },
            suggestions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "suggestions"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Resume Optimization Error:", error);
    return null;
  }
};

export const recommendSkills = async (resumeData: {
  summary: string;
  experience: { company: string; role: string; period: string; desc: string }[];
  projects: { name: string; role: string; desc: string }[];
  existingSkills?: string[];
}) => {
  if (isDevelopment) {
    return {
      suggestedSkills: [
        "Problem Solving",
        "Team Collaboration",
        "JavaScript",
        "React",
        "Git"
      ],
      reasoning:
        "Based on your project and internship experience, these skills are commonly highlighted in campus placement resumes."
    };
  }

  try {
    const prompt = `Based on the following student's past experience, projects, and current skills, suggest 5-10 additional technical and soft skills that would be relevant for campus placements and ATS screening. Avoid repeating skills that already exist. Return only concise skill names.\n\nData: ${JSON.stringify(
      resumeData
    )}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: {
              type: Type.STRING
            }
          },
          required: ["suggestedSkills"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Skill Recommendation Error:", error);
    return null;
  }
};

export const getSkillInsightSuggestion = async (input: {
  skills: string[];
  interests: string[];
  branch?: string;
}) => {
  if (isDevelopment) {
    return {
      recommendedSkill: "Three.js",
      why: "It complements your frontend/UI interests and helps you stand out with interactive 3D portfolios and demos.",
      plan: [
        "Learn core concepts: scene, camera, renderer",
        "Build a simple 3D landing page hero section",
        "Add animations + interactions (orbit controls, raycasting)",
        "Publish a demo and add it to your resume/portfolio"
      ],
      projects: [
        "Interactive 3D portfolio homepage",
        "3D product showcase for a campus startup"
      ]
    };
  }

  try {
    const prompt = `You are a campus career/learning coach. Given a student's skills, interests, and branch, recommend ONE high-impact skill to learn next. Provide a short reason (1-2 sentences), a 4-step practical learning plan, and 1-3 small project ideas.\n\nInput: ${JSON.stringify(
      input
    )}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSkill: { type: Type.STRING },
            why: { type: Type.STRING },
            plan: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["recommendedSkill", "plan"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Skill Insight Suggestion Error:", error);
    return null;
  }
};
