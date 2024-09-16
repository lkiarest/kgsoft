import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";
const titleMap = {
  '/': '单张图片压缩 - 开济在线工具',
  '/compress/multiple': '批量图片压缩 - 开济在线工具',
  '/idcard': '证件照生成 - 开济在线工具',
  '/about': '关于我们 - 开济在线工具'
};

export default () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.path;
    let title = '开济在线工具';
    if (titleMap[path]) {
      title = titleMap[path];
    } else {
      title = '页面未找到 - 开济在线工具';
    }

    document.title = title;
  }, [location.path]);
}
