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
      </div>
    </div>
  )
}
