import { useCallback, useEffect, useState } from 'preact/hooks'
import Slider from 'preact-material-components/Slider';
import Button from 'preact-material-components/Button';
import { formatSize } from '../../../utils/img'
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import 'preact-material-components/Slider/style.css';
import './index.less'

export default function(props) {
  const { imgFile, reselect } = props
  const [imgSrc, setImgSrc] = useState(null)
  const [imgSize, setImgSize] = useState('')
  const [rate, setRate] = useState(75)

  useEffect(() => {
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

  return (
    <div className="img-canvas">
      {imgSrc && (
        <>
          <div className="img-process">
            <div className="img-size">原图大小: {imgSize}</div>
            <div className="img-size">压缩比例: {rate}%</div>
            <Slider step={1} value={rate} max={100} onInput={onRateChange} />
            <div className="img-opts">
              <Button raised className="mdc-theme--secondary-bg">执行压缩</Button>
              <Button onClick={reselect}>重新选择</Button>
            </div>
          </div>
          <div className="img-view">
            <img src={imgSrc} />
            {/* <div className="img-cancel">重新选择</div> */}
          </div>
        </>
      )}
    </div>
  )
}
