#!/bin/bash

# SocialVibe Backend Quick Start Script
# 快速启动和部署脚本

set -e

echo "🚀 SocialVibe Backend 快速启动脚本"
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[信息]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[成功]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

print_error() {
    echo -e "${RED}[错误]${NC} $1"
}

# 检查是否在backend目录
if [ ! -f "package.json" ]; then
    print_error "请在backend目录中运行此脚本"
    exit 1
fi

# 步骤1：安装依赖
print_info "步骤1: 安装Node.js依赖..."
npm install
print_success "依赖安装完成"

# 步骤2：创建环境文件
if [ ! -f ".env" ]; then
    print_info "步骤2: 创建环境配置文件..."
    cp env.example .env
    print_success ".env文件已创建"
    print_warning "请编辑.env文件，设置MONGODB_URI和JWT_SECRET"
else
    print_info "步骤2: .env文件已存在，跳过创建"
fi

# 步骤3：检查Node.js版本
print_info "步骤3: 检查Node.js版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "需要Node.js 18+，当前版本: $(node -v)"
    print_info "请升级Node.js: https://nodejs.org/"
    exit 1
fi
print_success "Node.js版本检查通过: $(node -v)"

# 步骤4：测试应用启动
print_info "步骤4: 测试应用启动..."
timeout 10s npm start > /dev/null 2>&1 &
PID=$!
sleep 3

if kill -0 $PID 2>/dev/null; then
    print_success "应用启动测试通过"
    kill $PID
else
    print_error "应用启动失败，请检查配置"
    exit 1
fi

# 步骤5：显示下一步操作
echo ""
print_success "🎉 本地环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 .env 文件，设置以下变量："
echo "   - MONGODB_URI: 你的MongoDB Atlas连接字符串"
echo "   - JWT_SECRET: 生成一个强密钥"
echo ""
echo "2. 本地测试："
echo "   npm run dev"
echo ""
echo "3. 部署到Railway："
echo "   ./deploy.sh"
echo ""
echo "4. 查看详细部署指南："
echo "   cat DEPLOYMENT_GUIDE.md"
echo ""
echo "📚 有用的命令："
echo "   npm start          # 启动生产服务器"
echo "   npm run dev        # 启动开发服务器"
echo "   ./test-api.sh      # 测试API端点"
echo "   railway logs       # 查看Railway日志"
echo ""
print_success "祝您部署顺利！🚀" 