import { useState, useCallback, useRef } from 'preact/hooks'
import ImgCanvas from './ImgCanvas';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import ImgSelector from '../../../components/ImgSelector';
import './style.less';

export function SingleImgCompress() {
  const [imgFile, setImgFile] = useState(null)

  useDocumentTitle()

  const onFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgFile(e.target.files[0])
    }
  }, [])

  const handleReselect = () => {
    const imgInput = document.querySelector('#image-upload-input') as HTMLInputElement
    imgInput && imgInput.click()
  }

	return (
		<div class="img-compress">
      <ImgSelector multiple={false} hidden={!!imgFile} onChange={onFileChange} />
      {imgFile && <ImgCanvas imgFile={imgFile} reselect={handleReselect} />}
		</div>
	);
}
