import './index.less'

export default (props) => {
  const { hidden, multiple, onChange } = props
  const imgUploadClass = hidden ? 'image-upload-wrapper hide' : 'image-upload-wrapper'

  return (
    <div class={imgUploadClass}>
      <div className="upload-section">
        <label htmlFor="image-upload-input" className="custom-upload-button">
          选择图片
        </label>
        <input
          id="image-upload-input"
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={onChange}
          className="file-input"
        />
        <p className="security-info">
          温馨提示：我们采用本地压缩技术，您的图片不会上传到服务器。
          您的隐私安全是我们的首要考虑，请放心使用我们的服务。
          享受高效、安全的图片处理体验吧！
        </p>
      </div>
    </div>
  )
}
