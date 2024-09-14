import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import './index.less'
import { useState } from 'preact/hooks';

export function IdCard() {
  const [loaded, setLoaded] = useState(false)

  const frameClass = loaded ? "idcard-frame" : "idcard-frame hidden"

  return (
    <section className="idcard">
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
