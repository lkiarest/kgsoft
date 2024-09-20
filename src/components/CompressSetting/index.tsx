import { useState, useCallback } from 'preact/hooks';
import { ChangeEvent } from 'preact/compat';
import Slider from 'preact-material-components/Slider';
import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Slider/style.css';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Button/style.css';
import './index.less';

interface CompressSettingProps {
  rate: number;
  showResizeOpt: boolean;
  setRate: (rate: number) => void;
  imgWidth: number;
  imgHeight: number;
  resizeEnabled: boolean;
  setResizeEnabled: (enabled: boolean) => void;
  resizeWidth: number;
  setResizeWidth: (width: number) => void;
  resizeHeight: number;
  handleCompress: () => void;
  reselect: () => void;
  compressing: boolean;
}

export default function CompressSetting({
  rate,
  showResizeOpt,
  setRate,
  imgWidth,
  imgHeight,
  resizeEnabled,
  setResizeEnabled,
  resizeWidth,
  setResizeWidth,
  resizeHeight,
  handleCompress,
  reselect,
  compressing
}: CompressSettingProps) {
  const onRateChange = useCallback((e) => {
    setRate(e.detail.value);
  }, [setRate]);

  const btnText = compressing ? '压缩中' : '压缩'

  return (
    <div className="compress-setting">
      <div className="img-info">压缩比例: {rate}%</div>
      <Slider step={1} value={rate} min={20} max={100} onInput={onRateChange} />
      {showResizeOpt && (<>
        <div className="img-info">原图尺寸: {imgWidth}x{imgHeight}</div>
        <div className="img-info adjust-size">
          <span>尺寸调整:</span>
          <Switch checked={resizeEnabled} onChange={(e: ChangeEvent<HTMLInputElement>) => setResizeEnabled(e.currentTarget.checked)} />
        </div>
        {resizeEnabled && <div className="img-info">{resizeWidth}x{resizeHeight}</div>}
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
      </>)} 
      {!showResizeOpt && <div className="img-resize-tip">图片大小一致才能调整尺寸</div>}
      <div className="img-opts">
        <Button disabled={compressing} raised className="mdc-theme--secondary-bg" onClick={handleCompress}>{btnText}</Button>
        <Button disabled={compressing} onClick={reselect}>重选</Button>
      </div>
    </div>
  );
}
