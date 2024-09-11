/** 文件大小转为可读格式 */
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + " B"; // 小于1KB，直接显示字节
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB"; // 小于1MB，转换为KB
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"; // 小于1GB，转换为MB
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"; // 转换为GB
  }
}
