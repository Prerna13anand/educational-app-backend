import Video from '../models/Video.js';

const sampleVideos = [
    {
        videoId: 'iG9CE55wbtY',
        title: 'Do schools kill creativity?',
        thumbnail: 'https://i.ytimg.com/vi/iG9CE55wbtY/hqdefault.jpg',
        channel: 'TED',
    },
    {
        videoId: 'B1-g19biwM0',
        title: 'The Lensed Star Earendel',
        thumbnail: 'https://i.ytimg.com/vi/B1-g19biwM0/hqdefault.jpg',
        channel: 'Veritasium',
    },
    {
        videoId: 'SO_qX4VJhMQ',
        title: 'Essence of linear algebra',
        thumbnail: 'https://i.ytimg.com/vi/SO_qX4VJhMQ/hqdefault.jpg',
        channel: '3Blue1Brown',
    },
    {
        videoId: '6Zv6A92N46g',
        title: 'The Insane Engineering of the GEnx',
        thumbnail: 'https://i.ytimg.com/vi/6Zv6A92N46g/hqdefault.jpg',
        channel: 'Veritasium',
    },
    {
        videoId: 'U-f_6182g5E',
        title: 'Why Alien Life Would Be So Different',
        thumbnail: 'https://i.ytimg.com/vi/U-f_6182g5E/hqdefault.jpg',
        channel: 'Kurzgesagt',
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
// @desc    Get concepts for a specific video (MOCKED)
// @route   GET /api/concepts/:videoId
// @access  Public
// @desc    Get concepts for a specific video (MOCKED)
// @route   GET /api/concepts/:videoId
// @access  Public
export const getConceptsByVideoId = async (req, res) => { // <-- Add "export" here
  try {
    // This is MOCK data. Later, you will replace this with your real AI logic.
    const mockConcepts = [
      {
        _id: 'concept1',
        concept:
          'An algebraic expression is the result of combining numbers and algebraic symbols by means of the four fundamental operations.',
        reference: 'NCERT, Grade 7 Mathematics, Section 12.1, p. 236',
      },
      {
        _id: 'concept2',
        concept:
          'A variable is a symbol which takes various numerical values.',
        reference: 'NCERT, Grade 7 Mathematics, Section 12.2, p. 238',
      },
    ];

    res.status(200).json(mockConcepts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};