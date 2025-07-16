import Video from '../models/Video.js';
import { YoutubeTranscript } from 'youtube-transcript';

const sampleVideos = [
  {
    videoId: 'iG9CE55wbtY',
    title: 'Do schools kill creativity?',
    thumbnail: 'https://i.ytimg.com/vi/iG9CE55wbtY/hqdefault.jpg',
    channel: 'TED',
  },
  {
    videoId: '8KkKuTCFvgs',
    title: 'The Most Important Skill for the Next 10 Years',
    thumbnail: 'https://i.ytimg.com/vi/8KkKuTCFvgs/hqdefault.jpg',
    channel: 'Veritasium',
  },
  {
    videoId: 'f_SwD7RveNE',
    title: 'The REAL Answer to The Viral Chinese Math Problem',
    thumbnail: 'https://i.ytimg.com/vi/f_SwD7RveNE/hqdefault.jpg',
    channel: '3Blue1Brown',
  },
  {
    videoId: 'O-6e-y6A4zE',
    title: 'What Is the Resolution of the Universe?',
    thumbnail: 'https://i.ytimg.com/vi/O-6e-y6A4zE/hqdefault.jpg',
    channel: 'Kurzgesagt',
  },
  {
    videoId: 'y2gt_vS21eA',
    title: 'The Insane Engineering of the SR-71 Blackbird',
    thumbnail: 'https://i.ytimg.com/vi/y2gt_vS21eA/hqdefault.jpg',
    channel: 'Veritasium',
  },
  {
    videoId: 'G3GWA_iL-4k',
    title: 'Google I/O 2023 Keynote',
    thumbnail: 'https://i.ytimg.com/vi/G3GWA_iL-4k/hqdefault.jpg',
    channel: 'Google',
  },
];


export const processVideo = async (req, res) => {
  try {
    const { videoId, videoContent: manualContent } = req.body;

    if (!videoId && !manualContent) {
      return res
        .status(400)
        .send({ message: 'Video ID or manual content is required' });
    }

    let textForAI = '';

    if (videoId) {
      const youtubeApiKey = process.env.YOUTUBE_API_KEY;
      const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;

      const videoResponse = await fetch(videoApiUrl);
      const videoData = await videoResponse.json();

      if (videoData.items && videoData.items.length > 0) {
        const snippet = videoData.items[0].snippet;
        textForAI = `Title: ${snippet.title}\n\nDescription: ${snippet.description}`;
      }
    }

    if (!textForAI && manualContent) {
      textForAI = manualContent;
    }

    if (!textForAI) {
      throw new Error(
        'Could not retrieve video details and no manual content was provided.'
      );
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`;
    
    const prompt = `Based on the following content, identify the top 3 to 5 key educational concepts discussed. For each concept, provide a brief, one-sentence explanation.

    Content: """${textForAI}"""`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const apiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(
        `Google API call failed with status: ${apiResponse.status} - ${errorBody}`
      );
    }

    const responseData = await apiResponse.json();

    if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new Error('The AI model returned an empty response.');
    }

    const aiText = responseData.candidates[0].content.parts[0].text;

    res.json({
      message: 'AI processing complete!',
      sourceVideoId: videoId || 'Manual Content',
      aiConceptAnalysis: aiText,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to process video.' });
  }
};

export const seedVideos = async (req, res) => {
    try {
        await Video.deleteMany({});
        await Video.insertMany(sampleVideos);
        res.send('Sample videos have been added!');
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Failed to seed videos.' });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({});
        res.json(videos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
// Add this new function
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });

    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get AI-generated concepts for a specific video
// @route   GET /api/concepts/:videoId
// @access  Public
export const getConceptsByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;
    let transcriptText = '';

    // Part 1: Fetch the video transcript inside a try...catch block
    // This is the NEW, important part. It prevents the server from crashing.
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      if (transcriptData && transcriptData.length > 0) {
        transcriptText = transcriptData.map(item => item.text).join(' ');
      }
    } catch (transcriptError) {
      console.log(`Could not fetch transcript for videoId: ${videoId}. It may be disabled. Error: ${transcriptError.message}`);
      // If transcript fails, we will proceed with an empty string.
    }
    
    // If there's no transcript, we can't ask the AI, so we return an empty array.
    if (!transcriptText) {
      return res.json([]);
    }

    // Part 2: Send the transcript to the Google Gemini AI for analysis.
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error('Google API Key is not configured in environment variables.');
    }
    
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`;

    const prompt = `
      You are an expert educator specializing in mapping video content to Indian NCERT textbook concepts.
      Analyze the following YouTube video transcript.
      Identify the top 3 to 5 most relevant educational concepts discussed.
      For each concept, provide:
      1. A concise, one-sentence explanation of the concept.
      2. A plausible-sounding reference to an NCERT textbook (e.g., "NCERT, Grade 7 Mathematics, Section 12.1, p. 236").

      Your final output MUST be a valid JSON array of objects. Each object must have exactly three keys: "_id", "concept", and "reference". The "_id" should be a unique string for each concept.

      Transcript: """${transcriptText.substring(0, 8000)}"""
    `;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
          responseMimeType: "application/json",
      }
    };

    const apiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("Google API Error:", errorBody);
      throw new Error('Failed to get a valid response from the AI model.');
    }

    const responseData = await apiResponse.json();
    const aiJsonText = responseData.candidates[0].content.parts[0].text;
    const concepts = JSON.parse(aiJsonText);

    res.status(200).json(concepts);

  } catch (error) {
    console.error(`Error processing videoId ${req.params.videoId}:`, error.message);
    res.status(500).json([]);
  }
};