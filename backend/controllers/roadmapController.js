const axios = require('axios');
const Roadmap = require('../models/Roadmap');
const LearnerProfile = require('../models/LearnerProfile');
const { searchWeb } = require('../utils/scraper');

const OLLAMA_URL = 'http://localhost:11434/api/generate';

exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT token
    const isRegenerate = req.body.regenerate === true;

    if (isRegenerate) {
        await Roadmap.findOneAndDelete({ userId });
        console.log('Old roadmap deleted, generating new one...');
    }

    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({ message: 'User input not found. Please complete the input collection first.' });
    }

    const { currentSkills, preferences, careerGoals } = profile;

    let formattedSkills = 'None (Complete Beginner)';
    if (currentSkills && currentSkills.length > 0) {
      formattedSkills = currentSkills
        .map(s => {
          if (typeof s === 'string') return s;
          if (s && s.skill && s.level) return `${s.level} in ${s.skill}`;
          return String(s);
        })
        .join(', ');
    }

    console.log('Career Goal:', careerGoals);
    console.log('Skills:', formattedSkills);
    console.log('Preferences:', preferences);

    const variationText = isRegenerate ? 
`This is a REGENERATED roadmap request.
You must provide a DIFFERENT roadmap than before.
Use different topics, different sequences,
different resources and different projects.
Be creative and provide an alternative learning path
for the same career goal.` : '';

    const prompt = `You are an expert career counselor 
and learning path designer.
${variationText ? '\n' + variationText + '\n' : ''}
A learner has provided the following details:
- Current Skills: ${formattedSkills}
- Learning Preferences: ${preferences}
- Career Goal: ${careerGoals}

Your task is to create a DETAILED and SPECIFIC 
personalized learning roadmap for this exact 
career goal: "${careerGoals}"

The roadmap must be:
- Specific to the career goal "${careerGoals}"
- Not generic - tailor it exactly to this career
- Comprehensive with at least 8-10 topics
- Progressive from basics to advanced
- Practical with real actionable steps

You must respond with ONLY a valid JSON object.
Absolutely no explanation before or after.
No markdown formatting.
No code blocks.
No backticks.
Just the raw JSON object starting with { 
and ending with }

The JSON must follow this EXACT structure:
{
  "topics": [
    "Topic 1 specific to ${careerGoals}",
    "Topic 2 specific to ${careerGoals}",
    "Topic 3 specific to ${careerGoals}",
    "Topic 4 specific to ${careerGoals}",
    "Topic 5 specific to ${careerGoals}",
    "Topic 6 specific to ${careerGoals}",
    "Topic 7 specific to ${careerGoals}",
    "Topic 8 specific to ${careerGoals}"
  ],
  "sequences": [
    "Step 1: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 2: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 3: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 4: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 5: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 6: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 7: [Specific action for ${careerGoals}] - [Why this step matters]",
    "Step 8: [Specific action for ${careerGoals}] - [Why this step matters]"
  ],
  "resources": [
    {
      "topic": "Topic 1 name",
      "title": "Specific resource name for this topic",
      "type": "video",
      "url": "https://youtube.com",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 2 name",
      "title": "Specific resource name for this topic",
      "type": "article",
      "url": "https://medium.com",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 3 name",
      "title": "Specific resource name for this topic",
      "type": "course",
      "url": "https://coursera.org",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 4 name",
      "title": "Specific resource name for this topic",
      "type": "video",
      "url": "https://youtube.com",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 5 name",
      "title": "Specific resource name for this topic",
      "type": "course",
      "url": "https://udemy.com",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 6 name",
      "title": "Specific resource name for this topic",
      "type": "article",
      "url": "https://dev.to",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 7 name",
      "title": "Specific resource name for this topic",
      "type": "video",
      "url": "https://youtube.com",
      "description": "What this resource teaches"
    },
    {
      "topic": "Topic 8 name",
      "title": "Specific resource name for this topic",
      "type": "course",
      "url": "https://freecodecamp.org",
      "description": "What this resource teaches"
    }
  ],
  "projects": [
    {
      "title": "Beginner project specific to ${careerGoals}",
      "description": "Detailed description of what to build or do",
      "skills": ["skill1", "skill2", "skill3"]
    },
    {
      "title": "Intermediate project specific to ${careerGoals}",
      "description": "Detailed description of what to build or do",
      "skills": ["skill1", "skill2", "skill3"]
    },
    {
      "title": "Advanced project specific to ${careerGoals}",
      "description": "Detailed description of what to build or do",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ]
  ]
}

IMPORTANT RULES:
- Start your response with { immediately
- End your response with } immediately
- Do not write anything before {
- Do not write anything after }
- Do not use markdown
- Do not use backticks
- Do not add any explanation
- Return pure raw JSON only
- Make sure all strings use double quotes
- Make sure there are no trailing commas`;

    console.log('Sending prompt to Ollama...');
    console.log('Prompt length:', prompt.length);

    let ollamaResponse;
    try {
      ollamaResponse = await axios.post(
        `${process.env.OLLAMA_URL || 'http://localhost:11434'}/api/generate`,
        {
          model: process.env.OLLAMA_MODEL || 'qwen2.5:0.5b',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 4000,
            top_p: 0.9,
            stop: ['\n\n\n']
          }
        },
        {
          timeout: 120000
        }
      );
      console.log('Ollama response received');
    } catch (ollamaErr) {
      console.error('Ollama connection failed:', ollamaErr.message);
      let errorMsg = 'AI service unavailable. Start Ollama first.';
      if (ollamaErr.code === 'ECONNABORTED') {
          errorMsg = 'AI is taking too long. Please try again.';
      }
      return res.status(500).json({ message: errorMsg });
    }

    const rawResponse = ollamaResponse.data.response;

    console.log('=== RAW OLLAMA RESPONSE ===');
    console.log(rawResponse);
    console.log('=== END RAW RESPONSE ===');

    // Try multiple parsing strategies
    let roadmapData = null;

    // Strategy 1: Direct JSON parse
    try {
      roadmapData = JSON.parse(rawResponse.trim());
      console.log('Strategy 1 succeeded');
    } catch (e) {
      console.log('Strategy 1 failed:', e.message);
    }

    // Strategy 2: Remove markdown and parse
    if (!roadmapData) {
      try {
        let cleaned = rawResponse
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        roadmapData = JSON.parse(cleaned);
        console.log('Strategy 2 succeeded');
      } catch (e) {
        console.log('Strategy 2 failed:', e.message);
      }
    }

    // Strategy 3: Extract JSON between { and }
    if (!roadmapData) {
      try {
        const start = rawResponse.indexOf('{');
        const end = rawResponse.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const jsonStr = rawResponse.substring(start, end + 1);
          roadmapData = JSON.parse(jsonStr);
          console.log('Strategy 3 succeeded');
        }
      } catch (e) {
        console.log('Strategy 3 failed:', e.message);
      }
    }

    // Strategy 4: Fix common JSON issues and parse
    if (!roadmapData) {
      try {
        let cleaned = rawResponse
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .trim();
        
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        
        if (start !== -1 && end !== -1) {
          cleaned = cleaned.substring(start, end + 1);
          roadmapData = JSON.parse(cleaned);
          console.log('Strategy 4 succeeded');
        }
      } catch (e) {
        console.log('Strategy 4 failed:', e.message);
      }
    }

    // If all strategies failed, use fallback roadmap
    let usedFallback = false;
    if (!roadmapData) {
      console.error('All parsing strategies failed. Using fallback roadmap.');
      console.error('Raw response was:', rawResponse);
      usedFallback = true;
      
      roadmapData = {
        topics: [
          `Introduction to ${careerGoals}`,
          `Core concepts of ${careerGoals}`,
          `Intermediate skills for ${careerGoals}`,
          `Advanced techniques in ${careerGoals}`,
          `Professional practices for ${careerGoals}`,
          `Portfolio building for ${careerGoals}`,
          `Job preparation for ${careerGoals}`,
          `Career growth as ${careerGoals}`
        ],
        sequences: [
          `Step 1: Learn the basics of ${careerGoals}`,
          `Step 2: Build core skills for ${careerGoals}`,
          `Step 3: Practice intermediate concepts`,
          `Step 4: Work on real projects`,
          `Step 5: Build your portfolio`,
          `Step 6: Apply for jobs as ${careerGoals}`
        ],
        resources: [
          {
            topic: `Introduction to ${careerGoals}`,
            title: `Getting started with ${careerGoals}`,
            type: 'video',
            url: 'https://youtube.com',
            description: `Beginner guide to ${careerGoals}`
          },
          {
            topic: `Core concepts of ${careerGoals}`,
            title: `${careerGoals} fundamentals`,
            type: 'course',
            url: 'https://coursera.org',
            description: `Learn the fundamentals of ${careerGoals}`
          },
          {
            topic: `Advanced techniques in ${careerGoals}`,
            title: `Advanced ${careerGoals} course`,
            type: 'course',
            url: 'https://udemy.com',
            description: `Master advanced skills for ${careerGoals}`
          }
        ],
        projects: [
          {
            title: `Beginner ${careerGoals} project`,
            description: `Build a simple project to practice basic ${careerGoals} skills`,
            skills: [careerGoals]
          },
          {
            title: `Intermediate ${careerGoals} project`,
            description: `Build a more complex project to demonstrate your ${careerGoals} skills`,
            skills: [careerGoals]
          }
        ]
      };
    }

    // Validate all required fields
    if (!roadmapData.topics || 
        !Array.isArray(roadmapData.topics) || 
        roadmapData.topics.length < 3) {
      return res.status(500).json({
        message: 'Roadmap topics are missing or too few'
      });
    }

    if (!roadmapData.sequences || 
        !Array.isArray(roadmapData.sequences) || 
        roadmapData.sequences.length < 3) {
      return res.status(500).json({
        message: 'Roadmap sequences are missing or too few'
      });
    }

    if (!roadmapData.resources || 
        !Array.isArray(roadmapData.resources) || 
        roadmapData.resources.length < 3) {
      return res.status(500).json({
        message: 'Roadmap resources are missing or too few'
      });
    }

    if (!roadmapData.projects || 
        !Array.isArray(roadmapData.projects) || 
        roadmapData.projects.length < 1) {
      return res.status(500).json({
        message: 'Roadmap projects are missing'
      });
    }

    console.log('Roadmap generated successfully:', {
      topics: roadmapData.topics.length,
      sequences: roadmapData.sequences.length,
      resources: roadmapData.resources.length,
      projects: roadmapData.projects.length
    });

    try {
      let roadmap = await Roadmap.findOne({ userId });
      if (roadmap) {
        roadmap.topics = roadmapData.topics;
        roadmap.sequences = roadmapData.sequences;
        roadmap.resources = roadmapData.resources;
        roadmap.projects = roadmapData.projects;
        await roadmap.save();
      } else {
        roadmap = new Roadmap({
          userId,
          topics: roadmapData.topics,
          sequences: roadmapData.sequences,
          resources: roadmapData.resources,
          projects: roadmapData.projects
        });
        await roadmap.save();
      }
      res.status(201).json({ ...roadmap.toObject(), isFallback: usedFallback });
    } catch (dbErr) {
      console.error('Database save error:', dbErr);
      return res.status(500).json({ message: 'Failed to save roadmap. Please try again.' });
    }

  } catch (error) {
    console.error('Generate Roadmap Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    res.status(200).json({
      topics: roadmap.topics,
      sequences: roadmap.sequences,
      resources: roadmap.resources,
      projects: roadmap.projects
    });
  } catch (error) {
    console.error('Get Roadmap Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.generateMaterialsForTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    let roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    if (roadmap.topicMaterials && roadmap.topicMaterials.has(topic)) {
      return res.status(200).json({ materials: roadmap.topicMaterials.get(topic) });
    }

    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({ message: 'Learner profile not found.' });
    }

    let searchQuery = `${topic} learning resources`;
    let styleConstraint = "";
    
    if (profile.preferences === 'videos') {
      searchQuery = `${topic} beginner video tutorial site:youtube.com`;
      styleConstraint = "CRITICAL INSTRUCTION: The user specifically wants VIDEOS. You MUST return ONLY video links and titles. Do NOT return written articles.";
    } else if (profile.preferences === 'articles') {
      searchQuery = `${topic} tutorial blog article documentation -youtube`;
      styleConstraint = "CRITICAL INSTRUCTION: The user specifically wants ARTICLES. You MUST return ONLY written articles, blogs, or documentation. Do NOT return video links.";
    } else if (profile.preferences === 'projects') {
      searchQuery = `${topic} mini project ideas github tutorial`;
      styleConstraint = "CRITICAL INSTRUCTION: The user specifically wants PROJECTS. You MUST return practical project ideas, GitHub repositories, or hands-on tutorials.";
    }
    
    // Fetch real URLs
    let searchContext = "";
    try {
      const searchResults = await searchWeb(searchQuery);
      if (searchResults && searchResults.length > 0) {
        searchContext = `\nHere are some real search results for this topic. YOU MUST USE THESE EXACT URLs FOR THE LINKS:\n${JSON.stringify(searchResults, null, 2)}\n`;
      }
    } catch (err) {
      console.error("Search web error:", err.message);
    }

    const prompt = `You are a personalized learning assistant.
Generate learning materials for the specific topic: "${topic}".
The learner's preferred learning style is: ${profile.preferences}.
${styleConstraint}
${searchContext}
Provide a list of up to 5 specific, actionable learning resources tailored to this topic and learning style.
If real search results are provided above, your "link" fields MUST contain the exact URLs from those results. DO NOT hallucinate URLs.
If no search results are provided for some reason, provide detailed search terms instead.

You must respond with ONLY a valid JSON object.
No explanation, no extra text, no markdown.
The JSON must follow this exact structure:
{
  "materials": [
    { "title": "Resource Title", "description": "Brief description of the resource and why it fits the learning style.", "link": "Exact URL from search results or search term" }
  ]
}`;

    let ollamaResponse;
    try {
      ollamaResponse = await axios.post(OLLAMA_URL, {
        model: "qwen2.5:0.5b",
        prompt: prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.3,
          num_ctx: 1024
        }
      });
    } catch (ollamaErr) {
      console.error('Ollama connection failed:', ollamaErr.message);
      return res.status(500).json({ message: 'AI service is not available. Please make sure Ollama is running.' });
    }

    const rawResponse = ollamaResponse.data.response;
    let generatedData;

    try {
      const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      const jsonString = cleaned.substring(jsonStart, jsonEnd + 1);
      generatedData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', parseErr.message);
      return res.status(500).json({ message: 'Failed to parse AI response. Please try again.' });
    }

    if (!generatedData.materials || !Array.isArray(generatedData.materials)) {
      return res.status(500).json({ message: 'AI generated invalid materials format.' });
    }

    // Cache the result
    if (!roadmap.topicMaterials) {
      roadmap.topicMaterials = new Map();
    }
    roadmap.topicMaterials.set(topic, generatedData.materials);
    await roadmap.save();

    res.status(200).json({ materials: generatedData.materials });

  } catch (error) {
    console.error('Generate Materials Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
