import { useState, useCallback } from 'preact/hooks';
import * as ort from 'onnxruntime-web';
import { AutoModel, AutoProcessor, RawImage } from '@xenova/transformers';
import './index.less';

ort.env.wasm.wasmPaths = {
  'ort-wasm-simd.wasm': '/wasm/ort-wasm-simd.wasm',
  // 其他文件的路径...
};

export const Rmbg = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const [model, processor] = await Promise.all([
        AutoModel.from_pretrained('/briaai/RMBG-1.4', {
          // @ts-ignore
          device: 'webgpu',
          dtype: 'fp32',
        }),
        AutoProcessor.from_pretrained('/briaai/RMBG-1.4'),
      ]);

      let startTime = performance.now()
      const image = await RawImage.read(URL.createObjectURL(selectedFile));
      const { pixel_values } = await processor(image);
      console.log('---------------- pixel_values', performance.now() - startTime)
      startTime = performance.now()
      const { output } = await model({ input: pixel_values });
      console.log('---------------- output', performance.now() - startTime)
      startTime = performance.now()
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);
      console.log('---------------- mask', performance.now() - startTime)
      startTime = performance.now()
      const { width, height, data } = image.rgba();
      const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
      for (let i = 0; i < width * height; i++) {
        const alpha = mask.data[i];
        // 调整阈值，保留更多人像细节
        imageData.data[i * 4 + 3] = alpha;
      }
      console.log('---------------- imageData', performance.now() - startTime)
      startTime = performance.now()
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL());
    } catch (error) {
      console.error('处理图片时发生错误:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  return (
    <div className="rmbg-container">
      <div className="upload-section">
        <label className="upload-label" htmlFor="file-upload" style={{ pointerEvents: isProcessing ? 'none' : 'auto', opacity: isProcessing ? 0.5 : 1 }}>上传图片</label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isProcessing} />
        {previewImage && <img src={previewImage} alt="预览" className="preview-image" />}
      </div>
      <div className="process-section">
        <button onClick={handleProcessImage} disabled={!selectedFile || isProcessing}>{isProcessing ? '处理中...' : '处理图片'}</button>
        {processedImage && <img src={processedImage} alt="处理后" className="processed-image" />}
      </div>
    </div>
  );
};