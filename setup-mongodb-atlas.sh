#!/bin/bash

# MongoDB Atlas 配置脚本
# 用于自动配置MongoDB Atlas数据库

echo "🗄️  MongoDB Atlas 配置脚本"
echo "=========================="

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

# MongoDB Atlas 配置信息
ATLAS_EMAIL="peiqiwen7@gmail.com"
ATLAS_PASSWORD="WPQ850592231@"
PROJECT_NAME="SocialVibe"
CLUSTER_NAME="socialvibe-cluster"
DATABASE_NAME="socialvibe"
USERNAME="socialvibe_user"

echo "📧 邮箱: $ATLAS_EMAIL"
echo "🔐 密码: [已隐藏]"
echo "📁 项目名: $PROJECT_NAME"
echo "🗄️  集群名: $CLUSTER_NAME"
echo "💾 数据库名: $DATABASE_NAME"
echo "👤 用户名: $USERNAME"
echo ""

print_info "开始配置MongoDB Atlas..."

# 检查是否安装了MongoDB Atlas CLI
if ! command -v atlas &> /dev/null; then
    print_warning "MongoDB Atlas CLI 未安装"
    print_info "请先安装 MongoDB Atlas CLI:"
    echo "   brew install mongodb/atlas/atlas"
    echo "   或者访问: https://docs.atlas.mongodb.com/atlas-cli/install/"
    echo ""
    print_info "或者手动在网页界面配置:"
    echo "   1. 访问 https://cloud.mongodb.com"
    echo "   2. 使用邮箱 $ATLAS_EMAIL 登录"
    echo "   3. 创建新项目: $PROJECT_NAME"
    echo "   4. 创建免费集群: $CLUSTER_NAME"
    echo "   5. 配置数据库用户和网络访问"
    echo "   6. 获取连接字符串"
    exit 1
fi

print_success "MongoDB Atlas CLI 已安装"

# 登录到MongoDB Atlas
print_info "登录到MongoDB Atlas..."
if atlas auth login --username "$ATLAS_EMAIL" --password "$ATLAS_PASSWORD"; then
    print_success "登录成功"
else
    print_error "登录失败"
    print_info "请检查邮箱和密码是否正确"
    exit 1
fi

# 创建项目
print_info "创建项目: $PROJECT_NAME"
if atlas projects create "$PROJECT_NAME" --desc "SocialVibe Backend Database"; then
    print_success "项目创建成功"
else
    print_warning "项目可能已存在，继续下一步..."
fi

# 获取项目ID
PROJECT_ID=$(atlas projects list --output json | jq -r ".results[] | select(.name == \"$PROJECT_NAME\") | .id")
if [ -z "$PROJECT_ID" ]; then
    print_error "无法获取项目ID"
    exit 1
fi
print_success "项目ID: $PROJECT_ID"

# 创建集群
print_info "创建集群: $CLUSTER_NAME"
if atlas cluster create "$CLUSTER_NAME" --projectId "$PROJECT_ID" --provider AWS --region US_EAST_1 --tier M0; then
    print_success "集群创建成功"
else
    print_warning "集群可能已存在，继续下一步..."
fi

# 等待集群就绪
print_info "等待集群就绪..."
sleep 30

# 创建数据库用户
print_info "创建数据库用户: $USERNAME"
RANDOM_PASSWORD=$(openssl rand -base64 32)
if atlas dbusers create "$USERNAME" --projectId "$PROJECT_ID" --password "$RANDOM_PASSWORD" --role "readWriteAnyDatabase"; then
    print_success "数据库用户创建成功"
    print_warning "请保存密码: $RANDOM_PASSWORD"
else
    print_warning "数据库用户可能已存在，继续下一步..."
fi

# 配置网络访问
print_info "配置网络访问..."
if atlas accessList create 0.0.0.0/0 --projectId "$PROJECT_ID"; then
    print_success "网络访问配置成功"
else
    print_warning "网络访问可能已配置，继续下一步..."
fi

# 获取连接字符串
print_info "获取连接字符串..."
CONNECTION_STRING=$(atlas cluster connectionString "$CLUSTER_NAME" --projectId "$PROJECT_ID" --output json | jq -r '.standardSrv')
if [ -z "$CONNECTION_STRING" ]; then
    print_error "无法获取连接字符串"
    exit 1
fi

# 替换连接字符串中的占位符
FINAL_CONNECTION_STRING=$(echo "$CONNECTION_STRING" | sed "s/<password>/$RANDOM_PASSWORD/g" | sed "s/<dbname>/$DATABASE_NAME/g")

print_success "MongoDB Atlas 配置完成！"
echo ""
print_info "连接字符串:"
echo "$FINAL_CONNECTION_STRING"
echo ""
print_warning "请保存以下信息:"
echo "  用户名: $USERNAME"
echo "  密码: $RANDOM_PASSWORD"
echo "  数据库: $DATABASE_NAME"
echo ""

# 创建环境变量文件
print_info "创建环境变量文件..."
cat > .env.production << EOF
# MongoDB Atlas Configuration
NODE_ENV=production
PORT=3000
MONGODB_URI=$FINAL_CONNECTION_STRING
JWT_SECRET=$(openssl rand -base64 64)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
EOF

print_success "环境变量文件已创建: .env.production"
echo ""
print_info "下一步:"
echo "1. 将后端代码推送到GitHub"
echo "2. 在Railway中连接GitHub仓库"
echo "3. 使用上述连接字符串配置环境变量"
echo "4. 部署应用" 