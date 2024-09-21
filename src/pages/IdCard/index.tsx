import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import Button from 'preact-material-components/Button';
import { generateIdPhoto } from '../../api/hivision';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { backgroundColors, photoSizes } from './config';

import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import './index.less';

export const IdCard = () => {
  useDocumentTitle();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState(photoSizes[0].value);
  const [generatedPhoto, setGeneratedPhoto] = useState({ hd: null, standard: null });
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const mergedPhotoRef = useRef({ hd: null, standard: null });

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setGeneratedPhoto({ hd: null, standard: null }); // 重置生成的照片
      mergedPhotoRef.current = { hd: null, standard: null }; // 重置合并后的照片
    }
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    const [width, height] = selectedSize.split('x').map(Number);
    try {
      const result = await generateIdPhoto(selectedFile, height, width);
      if (result.status) {
        setGeneratedPhoto({
          hd: `${result.image_base64_hd}`,
          standard: `${result.image_base64_standard}`
        });
        // 初始化合并后的照片
        mergedPhotoRef.current = {
          hd: `${result.image_base64_hd}`,
          standard: `${result.image_base64_standard}`
        };
      } else {
        alert('生成失败，请重试');
      }
    } catch (error) {
      console.error('生成证件照时出错:', error);
      alert('生成失败，请重试');
    }
    setIsGenerating(false);
  }, [selectedFile, selectedSize]);

  const handleReupload = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setGeneratedPhoto({ hd: null, standard: null });
    mergedPhotoRef.current = { hd: null, standard: null };
  };

  const changeBackgroundColor = (color) => {
    if (!generatedPhoto.standard) {
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = generatedPhoto.standard;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const newStandard = canvas.toDataURL('image/jpeg');
        const newHD = canvas.toDataURL('image/jpeg', 1.0);

        mergedPhotoRef.current = {
          standard: newStandard,
          hd: newHD
        };
        // 强制重新渲染
        setBackgroundColor(color);
      }
    };
  };

  useEffect(() => {
    if (generatedPhoto.standard) {
      changeBackgroundColor(backgroundColor);
    }
  }, [backgroundColor, generatedPhoto.standard]);

  return (
    <div className="id-card-page">
      <div className="upload-section">
        {!selectedFile ? (
          <div className="file-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" />
            <label htmlFor="file-input">
              <div className="upload-icon">📁</div>
              <div className="upload-text">点击或拖拽上传图片</div>
            </label>
          </div>
        ) : (
          <div className="preview-image">
            <img src={previewImage} alt="预览图" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        )}
        {
          selectedFile && (
            <>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
              >
                {photoSizes.map((size) => (
                  <option key={size.value + size.label} value={size.value}>
                    {size.label} ({size.value})
                  </option>
                ))}
              </select>
              <Button
                raised
                onClick={handleGenerate}
                disabled={!selectedFile || isGenerating}
              >
                {isGenerating ? '生成中...' : '生成证件照'}
              </Button>
              <Button raised disabled={isGenerating} onClick={handleReupload}>重新上传</Button>
            </>
          )
        }
      </div>
      <div className="preview-section">
        {mergedPhotoRef.current.standard ? (
          <>
            <img 
              src={mergedPhotoRef.current.standard} 
              alt="生成的证件照" 
              style={{ maxWidth: '100%' }} 
            />
            <div className="color-picker">
              {backgroundColors.map((color) => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => changeBackgroundColor(color)}
                />
              ))}
            </div>
            <Button raised>
              <a href={mergedPhotoRef.current.hd} download="证件照.jpg">
                下载高清照片
              </a>
            </Button>
          </>
        ) : (
          <div className="preview-placeholder">
            上传图片并生成证件照后在此处预览
          </div>
        )}
      </div>
    </div>
  );
};
