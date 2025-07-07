#!/bin/bash

# GitHub 仓库初始化脚本
# 用于创建后端代码仓库并推送到GitHub

echo "🐙 GitHub 仓库初始化脚本"
echo "========================"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# 检查git是否安装
if ! command -v git &> /dev/null; then
    print_error "Git 未安装，请先安装 Git"
    exit 1
fi

print_success "Git 已安装"

# 检查是否已经初始化git
if [ -d ".git" ]; then
    print_warning "Git 仓库已存在"
    read -p "是否重新初始化? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .git
        print_info "已删除旧的 Git 仓库"
    else
        print_info "使用现有 Git 仓库"
    fi
fi

# 初始化git仓库
if [ ! -d ".git" ]; then
    print_info "初始化 Git 仓库..."
    git init
    print_success "Git 仓库初始化完成"
fi

# 创建 .gitignore 文件
print_info "创建 .gitignore 文件..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
*.tmp
*.temp
EOF

print_success ".gitignore 文件已创建"

# 添加所有文件到git
print_info "添加文件到 Git..."
git add .

# 创建初始提交
print_info "创建初始提交..."
git commit -m "Initial SocialVibe backend setup

- Node.js Express server
- MongoDB Atlas integration
- User authentication system
- Feed management API
- Vibe coin system
- Security middleware
- Production configuration"

print_success "初始提交完成"

echo ""
print_info "GitHub 仓库设置步骤："
echo ""
echo "1. 访问 https://github.com/new"
echo "2. 仓库名称: socialvibe-backend"
echo "3. 描述: SocialVibe Backend API Service"
echo "4. 选择: Private (推荐) 或 Public"
echo "5. 不要初始化 README、.gitignore 或 license"
echo "6. 点击 'Create repository'"
echo ""
echo "7. 复制仓库地址，然后运行以下命令："
echo "   git remote add origin https://github.com/YOUR_USERNAME/socialvibe-backend.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

read -p "是否继续设置远程仓库? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_info "请输入您的 GitHub 用户名:"
    read -p "GitHub 用户名: " GITHUB_USERNAME
    
    if [ -n "$GITHUB_USERNAME" ]; then
        print_info "添加远程仓库..."
        git remote add origin "https://github.com/$GITHUB_USERNAME/socialvibe-backend.git"
        
        print_info "设置主分支..."
        git branch -M main
        
        print_info "推送到 GitHub..."
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            print_success "代码已成功推送到 GitHub!"
            echo ""
            print_info "仓库地址: https://github.com/$GITHUB_USERNAME/socialvibe-backend"
            echo ""
            print_info "下一步:"
            echo "1. 在 Railway 中连接此 GitHub 仓库"
            echo "2. 配置环境变量"
            echo "3. 部署应用"
        else
            print_error "推送失败，请检查网络连接和仓库地址"
        fi
    else
        print_error "GitHub 用户名不能为空"
    fi
else
    print_info "请手动完成 GitHub 仓库设置"
fi 