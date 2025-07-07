#!/bin/bash

# 创建生产环境变量文件脚本

echo "🔧 创建生产环境变量文件"
echo "========================"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "请提供MongoDB Atlas连接字符串："
echo "格式: mongodb+srv://socialvibe_user:password@cluster.mongodb.net/socialvibe?retryWrites=true&w=majority"
echo ""

read -p "请输入连接字符串: " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    echo "❌ 连接字符串不能为空"
    exit 1
fi

# 生成JWT密钥
JWT_SECRET=$(openssl rand -base64 64)

# 创建环境变量文件
cat > .env.production << EOF
# MongoDB Atlas Configuration
NODE_ENV=production
PORT=3000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
EOF

print_success "环境变量文件已创建: .env.production"
echo ""
print_info "配置信息:"
echo "  MongoDB URI: $MONGODB_URI"
echo "  JWT Secret: [已生成]"
echo "  Environment: production"
echo ""
print_warning "请保存以下信息:"
echo "  JWT Secret: $JWT_SECRET"
echo ""
print_info "下一步:"
echo "1. 将后端代码推送到GitHub"
echo "2. 在Railway中连接GitHub仓库"
echo "3. 使用上述配置设置环境变量"
echo "4. 部署应用" 