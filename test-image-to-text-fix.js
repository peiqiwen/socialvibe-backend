const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// 测试图生文 API 的脚本
async function testImageToTextAPI() {
    console.log('🧪 Testing Image-to-Text API...');
    
    // 检查是否有测试图片
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
        console.log('📸 Creating a simple test image...');
        // 这里可以创建一个简单的测试图片
        console.log('⚠️  Please add a test image file named "test-image.jpg" in the backend directory');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('style', 'creative');
    formData.append('prompt', 'Generate a creative social media post');
    
    try {
        const response = await fetch('http://localhost:3000/api/ai/image-to-text', {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders(),
                'Authorization': 'Bearer your-test-token-here' // 如果需要认证
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ API test successful!');
            console.log('📝 Generated text:', result.data.generatedText);
            console.log('🏷️  Tags:', result.data.tags);
            console.log('💰 Cost:', result.data.cost);
        } else {
            console.log('❌ API test failed:', result.message);
        }
    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
}

// 运行测试
testImageToTextAPI(); 