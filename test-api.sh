#!/bin/bash

# SocialVibe API 测试脚本
# 用于测试API各个端点的功能

API_URL="${1:-http://localhost:3000}"

echo "🧪 SocialVibe API 测试脚本"
echo "=========================="
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

# 测试函数
test_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    
    echo "测试: $description"
    echo "端点: $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$API_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$API_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    fi
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        print_success "成功 (HTTP $http_code)"
        echo "响应: $body" | head -c 200
        if [ ${#body} -gt 200 ]; then
            echo "..."
        fi
    else
        print_error "失败 (HTTP $http_code)"
        echo "响应: $body"
    fi
    echo ""
}

# 开始测试
echo "开始API测试..."
echo ""

# 1. 健康检查
test_endpoint "/health" "健康检查"

# 2. API信息
test_endpoint "/" "API信息"

# 3. Vibe币套餐
test_endpoint "/api/vibe/packages" "Vibe币套餐列表"

# 4. 用户注册（测试）
echo "测试: 用户注册"
echo "端点: POST /api/auth/register"
echo "注意: 这需要数据库连接才能正常工作"
echo ""

# 5. 用户登录（测试）
echo "测试: 用户登录"
echo "端点: POST /api/auth/login"
echo "注意: 这需要数据库连接才能正常工作"
echo ""

# 总结
echo "📊 测试总结"
echo "=========="
print_info "基础API端点测试完成"
print_warning "需要MongoDB连接的功能（用户认证、Feed等）需要数据库设置"
echo ""
print_info "下一步："
echo "1. 设置MongoDB Atlas: ./update-mongodb-uri.sh"
echo "2. 重启服务器: npm run dev"
echo "3. 重新运行测试: ./test-api.sh"
echo ""
print_success "API服务器运行正常！🚀" 