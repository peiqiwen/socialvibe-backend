#!/bin/bash

# iOS 网络连接检查脚本

echo "🔍 iOS 网络连接检查"
echo "=================="

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
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    print_success "后端服务器正在运行"
else
    print_error "后端服务器未运行"
    print_info "请启动服务器: cd backend && node server.js"
    exit 1
fi

# 检查端口是否被监听
echo ""
echo "2. 检查端口监听状态..."
if lsof -i :3000 > /dev/null 2>&1; then
    print_success "端口3000正在被监听"
    lsof -i :3000
else
    print_error "端口3000未被监听"
fi

# 检查防火墙设置
echo ""
echo "3. 检查防火墙设置..."
if sudo pfctl -s rules 2>/dev/null | grep -q "3000"; then
    print_warning "防火墙可能阻止了端口3000"
else
    print_success "防火墙未阻止端口3000"
fi

# 测试localhost连接
echo ""
echo "4. 测试localhost连接..."
if curl -s http://localhost:3000/api/vibe/packages > /dev/null 2>&1; then
    print_success "localhost连接正常"
else
    print_error "localhost连接失败"
fi

# 检查iOS模拟器网络配置
echo ""
echo "5. iOS模拟器网络配置建议..."
print_info "iOS模拟器应该可以直接访问localhost"
print_info "如果仍然无法连接，请尝试以下解决方案："

echo ""
print_warning "解决方案1: 重启iOS模拟器"
echo "   - 完全关闭iOS模拟器"
echo "   - 重新启动iOS模拟器"
echo "   - 重新运行应用"

echo ""
print_warning "解决方案2: 检查Xcode网络设置"
echo "   - 在Xcode中，选择Product > Scheme > Edit Scheme"
echo "   - 在Run选项中，确保没有特殊的网络配置"

echo ""
print_warning "解决方案3: 使用127.0.0.1替代localhost"
echo "   - 将API地址改为: http://127.0.0.1:3000/api"

echo ""
print_warning "解决方案4: 检查Info.plist网络配置"
echo "   - 确保Info.plist中有正确的网络权限配置"

print_info "测试完成！" 