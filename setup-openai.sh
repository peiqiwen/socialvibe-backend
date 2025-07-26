#!/bin/bash

echo "🚀 Setting up OpenAI API for SocialVibe Backend..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# 安装 OpenAI 依赖
echo "📦 Installing OpenAI dependency..."
npm install openai@^4.20.1

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# 提示用户配置 API Key
echo ""
echo "🔑 Please configure your OpenAI API Key:"
echo "1. Open the .env file"
echo "2. Replace 'your_openai_api_key_here' with your actual OpenAI API Key"
echo "3. Save the file"
echo ""
echo "📋 Example:"
echo "OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""

# 检查是否已经配置了 API Key
if grep -q "your_openai_api_key_here" .env; then
    echo "⚠️  Warning: You still need to configure your OpenAI API Key in .env file"
else
    echo "✅ OpenAI API Key appears to be configured"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Configure your OpenAI API Key in .env file"
echo "2. Start the server: npm run dev"
echo "3. Test the API: curl http://localhost:3000/api/ai/health"
echo ""
echo "📚 API Endpoints:"
echo "- POST /api/ai/image-to-text - Generate text from image"
echo "- GET /api/ai/styles - Get available styles"
echo "- GET /api/ai/health - Health check"
echo ""

echo "✨ OpenAI setup completed!" 