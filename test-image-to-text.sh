#!/bin/bash

echo "🧪 Testing Image-to-Text API..."

# 检查服务器是否运行
echo "🔍 Checking if server is running..."
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo "❌ Server is not running. Please start the server first:"
    echo "   npm run dev"
    exit 1
fi

echo "✅ Server is running"

# 测试健康检查
echo ""
echo "🏥 Testing health check..."
curl -s http://localhost:3000/api/ai/health | jq '.'

# 测试获取风格列表
echo ""
echo "🎨 Testing styles endpoint..."
curl -s http://localhost:3000/api/ai/styles | jq '.'

# 检查是否有测试图片
if [ ! -f "test-image.jpg" ]; then
    echo ""
    echo "📸 No test image found. Creating a simple test..."
    echo "Please provide a test image file named 'test-image.jpg' in the backend directory"
    echo "Or use any image file and update the script accordingly"
    exit 1
fi

# 测试图生文功能
echo ""
echo "🖼️  Testing image-to-text functionality..."
echo "Using test image: test-image.jpg"

# 发送图片到 API
response=$(curl -s -X POST \
  -F "image=@test-image.jpg" \
  -F "style=creative" \
  -F "prompt=Generate a creative social media post" \
  http://localhost:3000/api/ai/image-to-text)

echo "📤 Response:"
echo "$response" | jq '.'

# 检查响应
if echo "$response" | jq -e '.success' > /dev/null; then
    echo ""
    echo "✅ Image-to-Text API test successful!"
    
    # 显示生成的文案
    generated_text=$(echo "$response" | jq -r '.data.generatedText')
    tags=$(echo "$response" | jq -r '.data.tags[]' | tr '\n' ' ')
    cost=$(echo "$response" | jq -r '.data.cost')
    
    echo ""
    echo "📝 Generated Text:"
    echo "$generated_text"
    echo ""
    echo "🏷️  Tags: $tags"
    echo "💰 Cost: $${cost}"
    
else
    echo ""
    echo "❌ Image-to-Text API test failed!"
    echo "Error: $(echo "$response" | jq -r '.message')"
fi

echo ""
echo "�� Test completed!" 