document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const uploadInput = document.getElementById('upload');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const maxWidthInput = document.getElementById('max-width');
    const compressBtn = document.getElementById('compress-btn');
    const downloadBtn = document.getElementById('download-btn');
    const originalPreview = document.getElementById('original-preview');
    const compressedPreview = document.getElementById('compressed-preview');
    const originalInfo = document.getElementById('original-info');
    const compressedInfo = document.getElementById('compressed-info');
    const previewSection = document.querySelector('.preview-section');
    
    // 存储图片
    let originalImage = null;
    let compressedImage = null;
    
    // 更新质量显示
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });
    
    // 处理文件上传
    uploadInput.addEventListener('change', (e) => {
        if (e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }
        
        originalImage = file;
        compressBtn.disabled = false;
        
        // 显示原图预览
        displayOriginalImage(file);
    });
    
    // 压缩按钮点击事件
    compressBtn.addEventListener('click', async () => {
        if (!originalImage) return;
        
        try {
            compressBtn.disabled = true;
            compressBtn.textContent = '压缩中...';
            
            // 压缩设置
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: parseInt(maxWidthInput.value),
                useWebWorker: true,
                quality: parseFloat(qualitySlider.value) / 100
            };
            
            // 压缩图片
            compressedImage = await imageCompression(originalImage, options);
            
            // 显示压缩后图片
            displayCompressedImage(compressedImage);
            
            compressBtn.textContent = '压缩图片';
            compressBtn.disabled = false;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('压缩失败:', error);
            alert('图片压缩失败，请重试！');
            compressBtn.textContent = '压缩图片';
            compressBtn.disabled = false;
        }
    });
    
    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
        if (!compressedImage) return;
        
        const url = URL.createObjectURL(compressedImage);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${compressedImage.name || 'image'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // 显示原图
    function displayOriginalImage(file) {
        const url = URL.createObjectURL(file);
        originalPreview.src = url;
        originalPreview.onload = () => {
            URL.revokeObjectURL(url);
            previewSection.style.display = 'block';
            
            // 显示原图信息
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            originalInfo.textContent = `文件名: ${file.name} | 大小: ${fileSizeMB} MB`;
        };
    }
    
    // 显示压缩后图片
    function displayCompressedImage(file) {
        const url = URL.createObjectURL(file);
        compressedPreview.src = url;
        compressedPreview.onload = () => {
            URL.revokeObjectURL(url);
            
            // 显示压缩后图片信息
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const compressionRatio = ((1 - (file.size / originalImage.size)) * 100).toFixed(1);
            compressedInfo.textContent = `大小: ${fileSizeMB} MB | 压缩率: ${compressionRatio}%`;
        };
    }
}); 