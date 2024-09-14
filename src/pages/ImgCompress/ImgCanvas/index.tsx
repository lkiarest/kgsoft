import { useCallback, useEffect, useState } from 'preact/hooks'
import { ChangeEvent } from 'preact/compat';
import Slider from 'preact-material-components/Slider';
import Button from 'preact-material-components/Button';
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';
import { Preview } from './Preview';
import Switch from 'preact-material-components/Switch';
import { formatSize } from '../../../utils/img'
import * as wasm from "../../../wasm/img-compress/wasm_test";
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import 'preact-material-components/Slider/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/Checkbox/style.css';
import 'preact-material-components/Switch/style.css';
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

  const onRateChange = useCallback((e) => {
    setRate(e.detail.value)
  }, [])

  const handleCompress = useCallback(() => {
    console.log('handleCompress')
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        const uint8Arr = new Uint8Array(e.target.result);
        const inputWidth = resizeEnabled ? resizeWidth : undefined
        const inputHeight = resizeEnabled ? resizeHeight : undefined
        const ret = wasm.compress_with_resize(uint8Arr, uint8Arr.length, rate, inputWidth, inputHeight);
        console.log('压缩结果', rate, ret);
        const url = URL.createObjectURL(new Blob([ret], { type: 'image/jpeg' }));
        setCompressedImg(url);
        setCompressedSize(formatSize(ret.length))
      } else {
        console.error('读取文件失败');
      }
    };
    reader.readAsArrayBuffer(imgFile);
  }, [imgFile, rate, resizeEnabled, resizeWidth, resizeHeight])

  return (
    <div className="img-canvas">
      {imgSrc && (
        <>
          <div className="img-process">
            <div className="img-info">原图大小: {imgSize}</div>
            <div className="img-info">压缩比例: {rate}%</div>
            <Slider step={1} value={rate} min={20} max={100} onInput={onRateChange} />
            <div className="img-info">原图尺寸: {imgWidth}x{imgHeight}</div>
            <div className="img-info adjust-size">
              <span>尺寸调整:</span>
              <Switch checked={resizeEnabled} onChange={(e: ChangeEvent<HTMLInputElement>) => setResizeEnabled(e.currentTarget.checked)} />
              {resizeEnabled && <span style="margin-right: 8px;">{resizeWidth}x{resizeHeight}</span>}
            </div>
            {resizeEnabled && (
              <div className="resize-slider">
                <Slider
                  step={1}
                  value={resizeWidth}
                  min={20}
                  max={imgWidth}
                  onInput={(e) => setResizeWidth(e.detail.value)}
                />
              </div>
            )}
            <div className="img-opts">
              <Button raised className="mdc-theme--secondary-bg" onClick={handleCompress}>执行压缩</Button>
              <Button onClick={reselect}>重新选择</Button>
            </div>
            {compressedImg && (<div className="compressed-info"><div className="img-info">压缩后大小: {compressedSize}</div>
              <div className="img-compress-btns">
                <Button raised className="mdc-theme--secondary-bg">
                  <a target="_blank" href={compressedImg} download={`${imgFile.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`}>下载图片</a>
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
            {/* <div className="img-cancel">重新选择</div> */}
          </div>
        </>
      )}
    </div>
  )
}
