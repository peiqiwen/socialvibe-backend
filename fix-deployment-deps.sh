#!/bin/bash

echo "🔧 Fixing deployment dependency issues..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

echo "📦 Updating package-lock.json..."
npm install

echo "🔍 Verifying dependencies..."
if npm list openai > /dev/null 2>&1; then
    echo "✅ OpenAI dependency is properly installed"
else
    echo "❌ OpenAI dependency is missing"
    exit 1
fi

echo "🧹 Cleaning up..."
rm -rf node_modules
npm ci

echo "✅ Deployment dependencies fixed!"
echo ""
echo "📋 Next steps:"
echo "1. Commit the updated package-lock.json file"
echo "2. Deploy to your hosting platform"
echo "3. Make sure to set OPENAI_API_KEY in your environment variables"
echo ""
echo "🚀 Ready for deployment!" 