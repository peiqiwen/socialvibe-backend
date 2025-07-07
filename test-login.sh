#!/bin/bash

# 登录测试脚本
# 用于测试用户注册和登录功能

API_URL="http://localhost:3000/api"

echo "🧪 用户认证测试脚本"
echo "=================="
echo "API URL: $API_URL"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 测试用户注册
echo "1. 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "displayName": "Test User"
  }')

echo "注册响应: $REGISTER_RESPONSE"
echo ""

# 测试用户登录
echo "2. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "登录响应: $LOGIN_RESPONSE"
echo ""

# 测试错误密码登录
echo "3. 测试错误密码登录..."
WRONG_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')

echo "错误密码登录响应: $WRONG_LOGIN_RESPONSE"
echo ""

print_info "测试完成！"
print_info "现在您可以在iOS应用中测试真实的登录功能了。" 