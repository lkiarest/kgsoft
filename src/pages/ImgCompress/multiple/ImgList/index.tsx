import { useRef, useState } from 'preact/hooks';
import { formatSize } from '../../../../utils/img';
import { Preview } from '../../single/ImgCanvas/Preview';
import Dialog from 'preact-material-components/Dialog';
import './style.less';

interface ImgListProps {
  imgFiles: File[];
  imageDimensions: string[];
  compressedImgs: string[];
  compressedSizes: number[];
  resizedDimension: string;
  showDimension: boolean;
  handleDelete: (index: number) => void;
}

const ImgList: React.FC<ImgListProps> = ({ imgFiles, showDimension, imageDimensions, resizedDimension, compressedImgs, compressedSizes, handleDelete }) => {
  const compressed = compressedSizes.length > 0
  const dialogRef = useRef(null)
  const [previewSrc, setPreviewSrc] = useState(null)

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

  const handlePreview = (src) => {
    setPreviewSrc(src)
    openModal()
  }

  return (
    <>
      <div className="image-list">
        {imgFiles.map((image, index) => (
          <div key={image} className="image-item">
            <img className="image-thumbnail" src={compressed ? compressedImgs[index] : URL.createObjectURL(image) } onClick={() => handlePreview(compressed ? compressedImgs[index] : URL.createObjectURL(image))} />
            <div className="image-info">
              <p className="file-name">{image.name}</p>
              <div className="file-size-dimensions">
                <p className="file-size">大小：{formatSize(compressed ? compressedSizes[index] : image.size)}</p>
                {showDimension && <p className="file-dimensions">尺寸：{resizedDimension || imageDimensions[index]}</p>}
              </div>
              <button className="delete-button" onClick={() => handleDelete(index)}>删除</button>
            </div>
          </div>
        ))}
      </div>
      <Dialog ref={dialogRef}>
        <Dialog.Body>
          <img src={previewSrc} alt="大图" style={{ maxWidth: '100%' }} />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.FooterButton accept onClick={closeModal}>关闭</Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export default ImgList;
