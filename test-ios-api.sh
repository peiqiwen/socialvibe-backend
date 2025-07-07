#!/bin/bash

# iOS API 测试脚本
# 使用宿主机IP地址测试API功能

API_URL="http://192.168.0.109:3000/api"

echo "🧪 iOS API 测试脚本"
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

# 测试健康检查
echo "1. 测试健康检查..."
HEALTH_RESPONSE=$(curl -s "$API_URL/../health")
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    print_success "健康检查通过"
else
    print_error "健康检查失败"
fi
echo ""

# 测试用户注册
echo "2. 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ios_test@example.com",
    "password": "password123",
    "username": "ios_test_user",
    "displayName": "iOS Test User"
  }')

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
    print_success "用户注册成功"
    echo "响应: $REGISTER_RESPONSE"
else
    print_error "用户注册失败"
    echo "响应: $REGISTER_RESPONSE"
fi
echo ""

# 测试用户登录
echo "3. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ios_test@example.com",
    "password": "password123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    print_success "用户登录成功"
    echo "响应: $LOGIN_RESPONSE"
else
    print_error "用户登录失败"
    echo "响应: $LOGIN_RESPONSE"
fi
echo ""

# 测试错误密码登录
echo "4. 测试错误密码登录..."
WRONG_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ios_test@example.com",
    "password": "wrongpassword"
  }')

if [[ $WRONG_LOGIN_RESPONSE == *"error"* ]]; then
    print_success "错误密码登录被正确拒绝"
    echo "响应: $WRONG_LOGIN_RESPONSE"
else
    print_error "错误密码登录未被拒绝"
    echo "响应: $WRONG_LOGIN_RESPONSE"
fi
echo ""

# 测试Vibe币套餐
echo "5. 测试Vibe币套餐..."
PACKAGES_RESPONSE=$(curl -s "$API_URL/vibe/packages")
if [[ $PACKAGES_RESPONSE == *"packages"* ]]; then
    print_success "Vibe币套餐获取成功"
else
    print_error "Vibe币套餐获取失败"
fi
echo ""

print_info "🎉 API测试完成！"
print_info "现在您可以在iOS应用中测试真实的登录功能了。"
print_info "使用以下测试账户："
print_info "邮箱: ios_test@example.com"
print_info "密码: password123" 