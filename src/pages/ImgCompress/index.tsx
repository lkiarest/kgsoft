import { useState, useCallback, useRef } from 'preact/hooks'
import ImgCanvas from './ImgCanvas';
import './style.less';

export function ImgCompress() {
  const [imgFile, setImgFile] = useState(null)
  const selectRef = useRef<HTMLInputElement>(null)

  const onFileChange = useCallback((e) => {
    console.log(e)
    if (e.target.files && e.target.files.length > 0) {
      setImgFile(e.target.files[0])
    }
  }, [])

  const handleReselect = () => {
    console.log('handleReselect')
    const imgInput = document.querySelector('#image-upload-input') as HTMLInputElement
    imgInput && imgInput.click()
  }

  const imgUploadClass = imgFile ? 'image-upload-wrapper hide' : 'image-upload-wrapper'

	return (
		<div class="img-compress">
      {
        <div class={imgUploadClass}>
          <div class="image-upload">
            <input type="file" id="image-upload-input" accept="image/*" style="display: none;" onChange={onFileChange} />
            <label for="image-upload-input" class="image-upload-label">
              选择图片文件
            </label>
          </div>
        </div>
      }
      {imgFile && <ImgCanvas imgFile={imgFile} reselect={handleReselect} />}
		</div>
	);
}
