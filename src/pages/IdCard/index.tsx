import { useState, useCallback, useEffect } from 'preact/hooks';
import Button from 'preact-material-components/Button';
import Select from 'preact-material-components/Select';
import { generateIdPhoto } from '../../api/hivision';
import useDocumentTitle from '../../hooks/useDocumentTitle';

import 'preact-material-components/Button/style.css';
import 'preact-material-components/Select/style.css';
import 'preact-material-components/Theme/style.css';
import './index.less';

const photoSizes = [
  { label: '大一寸', value: '390x567' },
  { label: '小一寸', value: '260x378' },
  { label: '二寸', value: '413x579' },
  { label: '三寸', value: '649x991' },
  { label: '四寸', value: '890x1280' },
  { label: '五寸', value: '1050x1499' },
  { label: '六寸', value: '1280x1810' },
  { label: '护照', value: '354x472' },
  { label: '驾照', value: '358x441' },
  { label: '学历照', value: '480x640' },
  { label: '简历照', value: '295x413' },
  { label: '社保卡', value: '358x441' },
  { label: '港澳通行证', value: '390x567' },
  { label: '英国签证', value: '450x600' },
  { label: '日本签证', value: '450x600' },
  { label: '美国签证', value: '600x600' },
  { label: '加拿大签证', value: '420x540' },
  { label: '澳大利亚签证', value: '330x440' },
  { label: '新西兰签证', value: '450x600' },
  { label: '韩国签证', value: '350x450' },
  { label: '泰国签证', value: '400x600' },
  { label: '欧盟申根签证', value: '350x450' },
  { label: '工作证', value: '413x626' },
  { label: '结婚证', value: '626x413' },
  { label: '身份证', value: '358x441' },
  { label: '学生证', value: '320x240' },
  { label: '军官证', value: '413x579' },
  { label: '党员证', value: '390x567' },
  { label: '出生证明', value: '295x413' },
  { label: '健康证', value: '413x579' },
  { label: '导游证', value: '413x579' },
  { label: '教师资格证', value: '413x579' },
  { label: '医师执业证', value: '413x579' },
  { label: '律师执业证', value: '413x579' },
  { label: '会计从业资格证', value: '413x579' },
];

const backgroundColors = [
  '#0066CC', // 蓝底
  '#FFFFFF', // 白底
  '#CC0033', // 红底
  '#CCCCCC', // 灰底
  '#009933', // 绿底
  '#FFCC00', // 黄底
  '#FFB6C1', // 粉底
  '#87CEFA', // 浅蓝底
  '#000080', // 深蓝底
  '#F5DEB3', // 米黄底
  '#E6E6FA', // 淡紫底
  '#FFA500', // 橙底
  '#006400', // 深绿底
  '#8B4513', // 棕底
  '#191970'  // 藏青底
];

export const IdCard = () => {
  useDocumentTitle();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState(photoSizes[0].value);
  const [generatedPhoto, setGeneratedPhoto] = useState({ hd: null, standard: null });
  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
        changeBackgroundColor(backgroundColor);
      } else {
        alert('生成失败，请重试');
      }
    } catch (error) {
      console.error('生成证件照时出错:', error);
      alert('生成失败，请重试');
    }
    setIsGenerating(false);
  }, [selectedFile, selectedSize, backgroundColor]);

  const handleReupload = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setGeneratedPhoto({ hd: null, standard: null });
  };

  const changeBackgroundColor = (color) => {
    if (!generatedPhoto.standard) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      setGeneratedPhoto(prevState => ({
        ...prevState,
        standard: canvas.toDataURL('image/jpeg'),
        hd: canvas.toDataURL('image/jpeg', 1.0)  // 添加高清版本的背景色
      }));
    };
    img.src = generatedPhoto.standard;
    setBackgroundColor(color);
  };

  useEffect(() => {
    if (generatedPhoto.standard) {
      changeBackgroundColor(backgroundColor);
    }
  }, [generatedPhoto.standard, backgroundColor]);

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
                  <option key={size.value} value={size.value}>
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
        {generatedPhoto.standard ? (
          <>
            <img src={generatedPhoto.standard} alt="生成的证件照" style={{ maxWidth: '100%' }} />
            <div className="color-picker">
              {backgroundColors.map((color) => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    changeBackgroundColor(color);
                    setBackgroundColor(color);
                  }}
                />
              ))}
            </div>
            <Button raised>
              <a href={generatedPhoto.hd} download="证件照.jpg">
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
