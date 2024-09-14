import { useCallback, useEffect, useState } from 'preact/hooks'
import Slider from 'preact-material-components/Slider';
import Button from 'preact-material-components/Button';
import { formatSize } from '../../../utils/img'
import * as wasm from "../../../wasm/img-compress/wasm_test";
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import 'preact-material-components/Slider/style.css';
import './index.less'

export default function(props) {
  const { imgFile, reselect } = props
  const [imgSrc, setImgSrc] = useState(null)
  const [imgSize, setImgSize] = useState('')
  const [rate, setRate] = useState(75)
  const [compressedImg, setCompressedImg] = useState(null)
  const [compressedSize, setCompressedSize] = useState('')

  useEffect(() => {
    setImgSrc(null)
    setImgSize('')
    setCompressedImg(null)
    setCompressedSize('')

    if (!imgFile) {
      return
    }

    setImgSize(formatSize(imgFile.size))

    var reader = new FileReader();
    reader.onload = function(e) {
      // 将读取到的图片URL设置为img标签的src属性
      setImgSrc(e.target.result)
    };
    reader.readAsDataURL(imgFile);
  }, [imgFile])

  const onRateChange = useCallback((e) => {
    setRate(e.detail.value)
  }, [])

  const handleCompress = useCallback(() => {
    console.log('handleCompress')
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        const uint8Arr = new Uint8Array(e.target.result);
        const ret = wasm.compress_with_quality(uint8Arr, uint8Arr.length, rate);
        console.log('压缩结果', rate, ret);
        const url = URL.createObjectURL(new Blob([ret], { type: 'image/jpeg' }));
        setCompressedImg(url);
        setCompressedSize(formatSize(ret.length))
      } else {
        console.error('读取文件失败');
      }
    };
    reader.readAsArrayBuffer(imgFile);
  }, [imgFile, rate])

  return (
    <div className="img-canvas">
      {imgSrc && (
        <>
          <div className="img-process">
            <div className="img-size">原图大小: {imgSize}</div>
            <div className="img-size">压缩比例: {rate}%</div>
            <Slider step={1} value={rate} max={100} onInput={onRateChange} />
            <div className="img-opts">
              <Button raised className="mdc-theme--secondary-bg" onClick={handleCompress}>执行压缩</Button>
              <Button onClick={reselect}>重新选择</Button>
            </div>
          </div>
          <div className="img-view">
            {!compressedImg && <img src={imgSrc} />}
            {compressedImg && (<div className="img-compress-result">
              <div className="img-size">压缩后大小: {compressedSize}</div>
              <div className="img-compress-btns">
                <a target="_blank" href={compressedImg} download={`${imgFile.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`}>下载压缩后的图片</a>
                <Button onClick={() => setCompressedImg(null)}>撤销压缩</Button>
              </div>
              <img src={compressedImg} />
            </div>)}
            {/* <div className="img-cancel">重新选择</div> */}
          </div>
        </>
      )}
    </div>
  )
}
