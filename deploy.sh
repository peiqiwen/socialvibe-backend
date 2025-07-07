#!/bin/bash

# SocialVibe 快速部署脚本
# 用于部署到 Railway 或其他云平台

echo "🚀 SocialVibe 部署脚本"
echo "======================"

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

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    print_error "请在 backend 目录中运行此脚本"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    print_info "安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "依赖安装失败"
        exit 1
    fi
    print_success "依赖安装完成"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    print_warning "未找到 .env 文件"
    print_info "请创建 .env 文件并配置以下变量："
    echo "   NODE_ENV=production"
    echo "   MONGODB_URI=your_mongodb_atlas_connection_string"
    echo "   JWT_SECRET=your_jwt_secret"
    echo ""
    print_info "或者复制 env.production.example 到 .env 并更新配置"
    exit 1
fi

# 测试本地运行
print_info "测试本地运行..."
node server.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 测试健康检查
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    print_success "本地服务器测试通过"
else
    print_error "本地服务器测试失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# 停止本地服务器
kill $SERVER_PID 2>/dev/null

print_success "✅ 部署准备完成！"
echo ""
print_info "下一步："
echo "1. 将代码推送到 GitHub"
echo "2. 在 Railway 中连接 GitHub 仓库"
echo "3. 配置环境变量"
echo "4. 部署完成"
echo ""
print_info "部署完成后，更新 iOS 应用中的 API 地址" 