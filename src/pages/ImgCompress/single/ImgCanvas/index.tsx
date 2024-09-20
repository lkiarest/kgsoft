import { useCallback, useEffect, useState } from 'preact/hooks'
import Button from 'preact-material-components/Button';
import { Preview } from './Preview';
import CompressSetting from '../../../../components/CompressSetting';
import { formatSize } from '../../../../utils/img'
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import useWasm from '../../../../hooks/useWasm';
import LoadingMask from '../../../../components/LoadingMask';
import './index.less'

export default function(props) {
  const { imgFile, reselect } = props
  const [imgSrc, setImgSrc] = useState(null)
  const [imgSize, setImgSize] = useState('')
  const [rate, setRate] = useState(75)
  const [compressedImg, setCompressedImg] = useState(null)
  const [compressedSize, setCompressedSize] = useState('')
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [resizeEnabled, setResizeEnabled] = useState(false)
  const [resizeWidth, setResizeWidth] = useState(0)
  const [resizeHeight, setResizeHeight] = useState(0)
  const [compressing, setCompressing] = useState(false)

  const [wasm] = useWasm()

  useEffect(() => {
    setImgSrc(null)
    setImgSize('')
    setCompressedImg(null)
    setCompressedSize('')

    if (!imgFile) {
      return
    }

    setImgSize(formatSize(imgFile.size))

    const reader = new FileReader();
    reader.onload = function(e) {
      setImgSrc(e.target.result)
      const img = new Image()
      img.onload = () => {
        setImgWidth(img.width)
        setImgHeight(img.height)
        setResizeWidth(img.width)
        setResizeHeight(img.height)
      }
      img.src = e.target.result as string
    };
    reader.readAsDataURL(imgFile);
  }, [imgFile])

  useEffect(() => {
    if (resizeEnabled) {
      const newHeight = Math.round(resizeWidth / (imgWidth / imgHeight));
      setResizeHeight(newHeight);
    }
  }, [resizeEnabled, resizeWidth, imgWidth, imgHeight]);

  const handleCompress = useCallback(() => {
    setCompressing(true)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        const uint8Arr = new Uint8Array(e.target.result);
        const inputWidth = resizeEnabled ? resizeWidth : undefined
        const inputHeight = resizeEnabled ? resizeHeight : undefined
        const ret = wasm.compress_with_resize(uint8Arr, uint8Arr.length, rate, inputWidth, inputHeight);
        const url = URL.createObjectURL(new Blob([ret], { type: 'image/jpeg' }));
        setCompressedImg(url);
        setCompressedSize(formatSize(ret.length))
        setCompressing(false)
      } else {
        console.error('读取文件失败');
        setCompressing(false)
      }
    };
    reader.readAsArrayBuffer(imgFile);
  }, [imgFile, rate, resizeEnabled, resizeWidth, resizeHeight])

  return (
    <div className="img-canvas">
      {imgSrc && (
        <>
          <div className="img-process">
            <CompressSetting
              rate={rate}
              showResizeOpt={true}
              setRate={setRate}
              imgWidth={imgWidth}
              imgHeight={imgHeight}
              resizeEnabled={resizeEnabled}
              setResizeEnabled={setResizeEnabled}
              resizeWidth={resizeWidth}
              setResizeWidth={setResizeWidth}
              resizeHeight={resizeHeight}
              handleCompress={handleCompress}
              reselect={reselect}
              compressing={compressing}
            />
            <div className="original-size">原图大小: {imgSize}</div>
            {compressedImg && (<div className="compressed-info"><div className="compressed-size">压缩后大小: {compressedSize}</div>
              <div className="img-compress-btns">
                <Button raised className="mdc-theme--secondary-bg">
                  <a target="_blank" href={compressedImg} download={`${imgFile.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`}>下载</a>
                </Button>
                <Button onClick={() => setCompressedImg(null)}>撤销</Button>
              </div>
            </div>)}
          </div>
          <div className="img-view">
            {!compressedImg && <Preview src={imgSrc} />}
            {compressedImg && (<div className="img-compress-result">
              <Preview src={compressedImg} />
            </div>)}
          </div>
        </>
      )}
    </div>
  )
}
