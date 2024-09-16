import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import { useState } from 'preact/hooks';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './index.less'

export function IdCard() {
  const [loaded, setLoaded] = useState(false)

  const frameClass = loaded ? "idcard-frame" : "idcard-frame hidden"

  useDocumentTitle()

  return (
    <section className="idcard">
      <div className="idcard-github">
        感谢开源: <a href="https://github.com/Zeyi-Lin/HivisionIDPhotos" target="_blank">ZeYiLin/HivisionIDPhotos</a>
      </div>
      {!loaded && (<div className="idcard-loading">
        第三方页面加载中...
        <LinearProgress indeterminate />
      </div>)}
      <iframe
        src="https://swanhub.co/demo/ZeYiLin/HivisionIDPhotos"
        frameborder="0"
        className={frameClass}
        onLoad={() => setLoaded(true)}
      ></iframe>
    </section>
  );
}
