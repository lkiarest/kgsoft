import { useRef, useState } from 'preact/hooks';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { generateIdPhoto } from './api/hivision';
import Dialog from 'preact-material-components/Dialog';
import './index.less'

export function Matting() {
  useDocumentTitle()
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setOriginalImage(URL.createObjectURL(file));
      try {
        const result = await generateIdPhoto(file, 413, 295);
        if (result.status) {
          setProcessedImage(result.image_base64);
        } else {
          throw new Error('抠图处理失败');
        }
      } catch (error) {
        console.error('抠图失败:', error);
        if (error.response && error.response.status === 503) {
          alert('请求太频繁，请稍后再试');
        } else {
          alert('抠图失败，请重试');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = '抠图结果.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.MDComponent.show()
    }
  }

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.MDComponent.close()
    }
  }

  return (
    <div className="idcard-container">
      <div className="upload-section">
        <label htmlFor="file-upload" className={`custom-upload-button ${isLoading ? 'disabled' : ''}`}>
          选择图片
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          disabled={isLoading}
        />
        {originalImage && (
          <img src={originalImage} alt="原图" className="preview-image" />
        )}
      </div>
      <div className="result-section">
        {isLoading ? (
          <div className="loading">
            <span className="loading-spinner"></span>
            处理中...
          </div>
        ) : processedImage ? (
          <>
            <div className="action-buttons">
              <button onClick={handleDownload} className="download-button">
                下载结果
              </button>
              <Dialog ref={dialogRef}>
                <Dialog.Body>
                  <img src={processedImage} alt="大图" style={{ maxWidth: '100%' }} />
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.FooterButton accept onClick={closeModal}>关闭</Dialog.FooterButton>
                </Dialog.Footer>
              </Dialog>
            </div>
            <img src={processedImage} alt="抠图结果" className="result-image" onClick={openModal} />
          </>
        ) : (
          <div className="no-result">
            <i className="upload-icon"></i>
            <p>请上传图片进行抠图</p>
          </div>
        )}
      </div>
    </div>
  );
}
