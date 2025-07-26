const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const router = express.Router();
const { auth } = require('../middleware/auth');

// 配置 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 配置 multer 用于文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 限制
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  },
});

// AI content suggestions generation
router.post('/content-suggestions', auth, async (req, res) => {
    try {
        const { initialText } = req.body;
        
        // Simulate AI content suggestions
        const suggestions = [
            "Share an interesting moment from your life and let your friends feel your joy!",
            "Record today's beautiful moments, these memories are worth cherishing.",
            "Share your thoughts and feelings with everyone, the real you is most charming.",
            "Use words to record life's little moments, making every day meaningful.",
            "How are you feeling today? Share it with everyone!",
            "Is there anything interesting you'd like to share with everyone?"
        ];
        
        res.json({
            success: true,
            suggestions: suggestions
        });
    } catch (error) {
        console.error('AI content suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate content suggestions'
        });
    }
});

// AI topic suggestions generation
router.post('/topic-suggestions', auth, async (req, res) => {
    try {
        const { context } = req.body;
        
        // Simulate AI topic suggestions
        const topics = [
            "#DailyLife", "#FoodShare", "#TravelRecord", "#MoodDiary",
            "#WorkInsights", "#LearningNotes", "#HealthyLife", "#CreativeInspiration",
            "#MusicShare", "#MovieRecommendation", "#BookNotes", "#Fitness"
        ];
        
        res.json({
            success: true,
            topics: topics
        });
    } catch (error) {
        console.error('AI topic suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate topic suggestions'
        });
    }
});

// AI tag suggestions generation
router.post('/tag-suggestions', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        // Simulate AI tag suggestions
        const tags = [
            "Life", "Share", "Daily", "Beautiful", "Record",
            "Mood", "Insights", "Creative", "Inspiration", "Happy",
            "Food", "Travel", "Work", "Learning", "Health"
        ];
        
        res.json({
            success: true,
            tags: tags
        });
    } catch (error) {
        console.error('AI tag suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate tag suggestions'
        });
    }
});

// AI hashtag suggestions generation
router.post('/hashtag-suggestions', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        // Simulate AI hashtag suggestions
        const hashtags = [
            "#SocialVibe", "#LifeShare", "#DailyRecord", "#BeautifulMoments",
            "#MoodDiary", "#CreativeLife", "#HappyShare", "#LifeInsights",
            "#FoodShare", "#TravelRecord", "#WorkInsights", "#LearningNotes"
        ];
        
        res.json({
            success: true,
            hashtags: hashtags
        });
    } catch (error) {
        console.error('AI hashtag suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate hashtag suggestions'
        });
    }
});

// AI内容优化建议
router.post('/optimization-suggestions', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        // 模拟AI内容优化建议
        const suggestions = [
            "建议添加更多细节描述，让内容更生动",
            "可以加入一些个人感受，增加情感共鸣",
            "考虑添加相关话题标签，提高曝光度",
            "内容长度适中，建议保持在100-300字之间",
            "可以加入一些表情符号，让内容更活泼",
            "建议在开头吸引读者注意力"
        ];
        
        res.json({
            success: true,
            suggestions: suggestions
        });
    } catch (error) {
        console.error('AI optimization suggestions error:', error);
        res.status(500).json({
            success: false,
            message: '生成优化建议失败'
        });
    }
});

// AI图片分析
router.post('/image-analysis', auth, async (req, res) => {
    try {
        const { image } = req.body;
        
        // 模拟AI图片分析
        const analysis = {
            tags: ["生活", "日常", "分享", "美好"],
            description: "这是一张生活照片，展现了日常的美好瞬间",
            suggestedContent: "记录下这个美好的瞬间，让生活更有意义！",
            sentiment: "positive",
            confidence: 0.85
        };
        
        res.json({
            success: true,
            analysis: analysis
        });
    } catch (error) {
        console.error('AI image analysis error:', error);
        res.status(500).json({
            success: false,
            message: '图片分析失败'
        });
    }
});

// AI情感分析
router.post('/sentiment-analysis', auth, async (req, res) => {
    try {
        const { text } = req.body;
        
        // 模拟AI情感分析
        const sentiment = {
            sentiment: "positive",
            confidence: 0.85,
            keywords: ["快乐", "美好", "分享", "生活"],
            suggestions: [
                "内容情感积极，建议保持这种正能量",
                "可以加入更多细节描述",
                "考虑添加相关话题标签"
            ]
        };
        
        res.json({
            success: true,
            sentiment: sentiment
        });
    } catch (error) {
        console.error('AI sentiment analysis error:', error);
        res.status(500).json({
            success: false,
            message: '情感分析失败'
        });
    }
});

// AI智能推荐
router.post('/smart-recommendations', auth, async (req, res) => {
    try {
        const { userInterests, contentHistory } = req.body;
        
        // 模拟AI智能推荐
        const recommendations = {
            contentIdeas: [
                "分享你的兴趣爱好，让更多人了解你",
                "记录今天的学习收获，激励自己和他人",
                "分享一个有趣的生活小技巧",
                "推荐一本好书或一部好电影"
            ],
            trendingTopics: [
                "#生活分享", "#学习心得", "#美食推荐", "#旅行记录"
            ],
            engagementTips: [
                "在内容中加入问题，鼓励互动",
                "使用表情符号增加亲和力",
                "分享个人经历，增加真实感",
                "定期发布内容，保持活跃度"
            ]
        };
        
        res.json({
            success: true,
            recommendations: recommendations
        });
    } catch (error) {
        console.error('AI smart recommendations error:', error);
        res.status(500).json({
            success: false,
            message: '智能推荐失败'
        });
    }
});

// AI内容质量评估
router.post('/content-quality-assessment', auth, async (req, res) => {
    try {
        const { content, images, tags } = req.body;
        
        // 模拟AI内容质量评估
        const assessment = {
            overallScore: 85,
            readability: 90,
            engagement: 80,
            originality: 85,
            suggestions: [
                "内容结构清晰，表达流畅",
                "建议添加更多个人观点",
                "图片质量良好，与内容匹配",
                "标签选择合适，有助于发现"
            ],
            improvements: [
                "可以加入更多细节描述",
                "考虑添加相关链接或引用",
                "建议在结尾加入互动元素"
            ]
        };
        
        res.json({
            success: true,
            assessment: assessment
        });
    } catch (error) {
        console.error('AI content quality assessment error:', error);
        res.status(500).json({
            success: false,
            message: '内容质量评估失败'
        });
    }
});

// 图生文 API 端点
router.post('/image-to-text', upload.single('image'), async (req, res) => {
  try {
    const { style, prompt } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: '请上传图片文件'
      });
    }

    // 将图片转换为 base64
    const base64Image = imageFile.buffer.toString('base64');

    // 根据风格准备提示词
    const stylePrompts = {
      creative: "Analyze this image and create a creative, engaging social media post. Make it inspiring and shareable. Focus on the visual elements, mood, and story behind the image. Write in a conversational tone that encourages engagement. Also suggest 5 relevant hashtags.",
      
      professional: "Analyze this image and create a professional, polished social media post. Focus on the key elements, composition, and professional appeal. Write in a clear, informative tone suitable for business or professional networking. Also suggest 5 relevant hashtags.",
      
      casual: "Analyze this image and create a casual, friendly social media post. Make it relatable and easy-going. Focus on everyday moments and personal experiences. Write in a warm, conversational tone. Also suggest 5 relevant hashtags.",
      
      poetic: "Analyze this image and create a poetic, artistic social media post. Focus on the beauty, emotions, and deeper meaning. Use descriptive language and create an artistic narrative. Write in an elegant, expressive tone. Also suggest 5 relevant hashtags."
    };

    const selectedPrompt = stylePrompts[style] || stylePrompts.creative;
    const finalPrompt = prompt ? `${prompt}\n\n${selectedPrompt}` : selectedPrompt;

    // 调用 OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 使用 GPT-4o 模型
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: finalPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const generatedText = response.choices[0].message.content;

    // 提取标签
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(generatedText)) !== null) {
      hashtags.push(match[1]);
    }

    // 如果没有找到标签，生成一些通用标签
    if (hashtags.length < 3) {
      const tagResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Based on this image description: "${generatedText.substring(0, 200)}...", suggest 5 relevant hashtags for social media. Return only the hashtag names without the # symbol, separated by commas.`
          }
        ],
        max_tokens: 100,
        temperature: 0.5
      });

      const suggestedTags = tagResponse.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      hashtags.push(...suggestedTags);
    }

    // 去重并限制标签数量
    const uniqueTags = [...new Set(hashtags)].slice(0, 5);

    // 计算成本（用于监控）
    const inputTokens = response.usage.prompt_tokens;
    const outputTokens = response.usage.completion_tokens;
    const totalCost = (inputTokens * 0.01 + outputTokens * 0.03) / 1000;

    console.log(`Image-to-Text API 调用成功 - 成本: $${totalCost.toFixed(4)}`);

    res.json({
      success: true,
      data: {
        generatedText,
        imageDescription: generatedText.substring(0, 100) + "...",
        tags: uniqueTags,
        style,
        confidence: 0.95,
        cost: totalCost.toFixed(4)
      }
    });

  } catch (error) {
    console.error('图生文 API 错误:', error);
    
    // 处理不同类型的错误
    if (error.code === 'insufficient_quota') {
      res.status(429).json({
        success: false,
        message: 'API 配额不足，请稍后重试或升级账户'
      });
    } else if (error.code === 'invalid_api_key') {
      res.status(401).json({
        success: false,
        message: 'API 密钥无效，请检查配置'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '图片处理失败，请重试',
        error: error.message
      });
    }
  }
});

// 获取支持的风格列表
router.get('/styles', (req, res) => {
  const styles = [
    {
      id: 'creative',
      name: 'Creative',
      description: '创意风格，激发灵感，鼓励分享',
      emoji: '🎨'
    },
    {
      id: 'professional',
      name: 'Professional', 
      description: '专业风格，适合商务和专业社交',
      emoji: '💼'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: '轻松风格，日常友好，易于理解',
      emoji: '😊'
    },
    {
      id: 'poetic',
      name: 'Poetic',
      description: '诗意风格，艺术性强，富有诗意',
      emoji: '🌸'
    }
  ];

  res.json({
    success: true,
    data: styles
  });
});

// 健康检查端点
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI 服务运行正常',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 