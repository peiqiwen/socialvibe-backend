#!/bin/bash

# 真机调试 API 测试脚本
# 使用局域网IP地址测试API功能

API_URL="http://192.168.0.109:3000/api"

echo "📱 真机调试 API 测试脚本"
echo "======================"
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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查服务器是否运行
echo "1. 检查后端服务器状态..."
if curl -s http://192.168.0.109:3000/health > /dev/null 2>&1; then
    print_success "后端服务器正在运行"
else
    print_error "后端服务器未运行或无法访问"
    print_info "请确保："
    print_info "1. 服务器已启动: cd backend && node server.js"
    print_info "2. 防火墙允许端口3000"
    print_info "3. 设备在同一网络"
    exit 1
fi

# 测试健康检查
echo ""
echo "2. 测试健康检查..."
HEALTH_RESPONSE=$(curl -s http://192.168.0.109:3000/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    print_success "健康检查通过"
    echo "响应: $HEALTH_RESPONSE"
else
    print_error "健康检查失败"
    echo "响应: $HEALTH_RESPONSE"
fi

# 测试用户注册
echo ""
echo "3. 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "device_test@example.com",
    "password": "password123",
    "username": "device_test_user",
    "displayName": "Device Test User"
  }')

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
    print_success "用户注册成功"
    echo "响应: $REGISTER_RESPONSE"
else
    print_error "用户注册失败"
    echo "响应: $REGISTER_RESPONSE"
fi

# 测试用户登录
echo ""
echo "4. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "device_test@example.com",
    "password": "password123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    print_success "用户登录成功"
    echo "响应: $LOGIN_RESPONSE"
else
    print_error "用户登录失败"
    echo "响应: $LOGIN_RESPONSE"
fi

# 测试Vibe币套餐
echo ""
echo "5. 测试Vibe币套餐..."
PACKAGES_RESPONSE=$(curl -s "$API_URL/vibe/packages")
if [[ $PACKAGES_RESPONSE == *"packages"* ]]; then
    print_success "Vibe币套餐获取成功"
else
    print_error "Vibe币套餐获取失败"
fi

echo ""
print_info "🎉 真机调试API测试完成！"
print_info "现在您可以在真机上测试应用了。"
print_info ""
print_info "📱 真机调试注意事项："
print_info "1. 确保iOS设备和Mac在同一WiFi网络"
print_info "2. 在Xcode中配置正确的开发者证书"
print_info "3. 在设备上信任开发者证书"
print_info "4. 使用测试账户登录："
print_info "   邮箱: device_test@example.com"
print_info "   密码: password123" 