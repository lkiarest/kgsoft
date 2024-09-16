import './index.less'

export default (props) => {
  const { hidden, multiple, onChange } = props
  const imgUploadClass = hidden ? 'image-upload-wrapper hide' : 'image-upload-wrapper'

  return (
    <div class={imgUploadClass}>
      <div class="image-upload">
        <input type="file" multiple={multiple} id="image-upload-input" accept="image/*" style="display: none;" onChange={onChange} />
        <label for="image-upload-input" class="image-upload-label">
          选择图片文件
        </label>
      </div>
    </div>
  )
}
