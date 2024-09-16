import { useState, useRef } from 'preact/hooks'
import Dialog from 'preact-material-components/Dialog'
import 'preact-material-components/Dialog/style.css'

export const Preview = (props) => {
  const { src, className } = props
  const dialogRef = useRef(null)

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.MDComponent.show()
    }
  }

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.MDComponent.close()
    }
  }

  return (
    <div className="preview-container">
      <img
        className={className}
        src={src} 
        alt="预览图" 
        title="点击查看大图"
        style={{ cursor: 'pointer' }}
        onClick={openModal}
      />

      <Dialog ref={dialogRef}>
        <Dialog.Body>
          <img src={src} alt="大图" style={{ maxWidth: '100%' }} />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.FooterButton accept onClick={closeModal}>关闭</Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
}
