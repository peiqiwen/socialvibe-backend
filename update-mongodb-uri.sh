#!/bin/bash

# MongoDB Atlas URI 更新脚本
# 用于快速更新 .env 文件中的 MONGODB_URI

echo "🗄️ MongoDB Atlas URI 更新脚本"
echo "=============================="

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

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
    print_error ".env文件不存在，请先运行: cp env.example .env"
    exit 1
fi

echo ""
print_info "请按照以下步骤操作："
echo ""
echo "1. 访问 MongoDB Atlas: https://cloud.mongodb.com"
echo "2. 创建免费账户和集群"
echo "3. 配置数据库用户和网络访问"
echo "4. 获取连接字符串"
echo ""
echo "连接字符串格式示例："
echo "mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
echo ""

# 获取用户输入
read -p "请输入您的MongoDB Atlas连接字符串: " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    print_error "连接字符串不能为空"
    exit 1
fi

# 检查连接字符串格式
if [[ ! "$MONGODB_URI" =~ ^mongodb\+srv:// ]]; then
    print_warning "连接字符串格式可能不正确，请检查"
fi

# 添加数据库名称
if [[ "$MONGODB_URI" == *"?retryWrites=true&w=majority" ]]; then
    # 在?前添加数据库名
    MONGODB_URI_WITH_DB="${MONGODB_URI/\?retryWrites=true&w=majority/\/socialvibe?retryWrites=true&w=majority}"
else
    # 如果没有查询参数，直接添加数据库名
    MONGODB_URI_WITH_DB="${MONGODB_URI}/socialvibe"
fi

# 更新.env文件
print_info "更新 .env 文件..."
sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI_WITH_DB|" .env

if [ $? -eq 0 ]; then
    print_success "MONGODB_URI 已更新"
    echo ""
    print_info "更新后的连接字符串："
    echo "$MONGODB_URI_WITH_DB"
    echo ""
    
    # 显示当前配置
    print_info "当前 .env 配置："
    grep "^MONGODB_URI=" .env
    echo ""
    
    print_success "✅ 配置完成！"
    echo ""
    print_info "下一步操作："
    echo "1. 重启服务器: npm run dev"
    echo "2. 测试连接: curl http://localhost:3000/health"
    echo "3. 查看详细设置指南: cat setup-mongodb-atlas.md"
    
else
    print_error "更新失败，请手动编辑 .env 文件"
    echo "请将以下行添加到 .env 文件："
    echo "MONGODB_URI=$MONGODB_URI_WITH_DB"
fi 