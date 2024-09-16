import useDocumentTitle from '../../hooks/useDocumentTitle';
import './index.less'

export function About() {
	useDocumentTitle()

	const addToFavorites = () => {
		// 在这里实现添加收藏的逻辑
		try {
			// 现代浏览器不支持直接添加收藏，我们可以提示用户如何手动添加
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
			const key = isMac ? 'Command/Cmd' : 'CTRL';
			alert(`请按 ${key} + D 键添加书签`);
		} catch (error) {
			console.error('添加收藏失败:', error);
		}
	}

	return (
		<section className="about">
			<div className="about-slogon">免费工具集 | 且用且珍惜</div>
			<div className="about-contact"></div>
			<div className="about-prods">
				<div className="about-prods-item">
					<h2 class="about-prods-item-title">图片压缩</h2>
					<div class="about-prods-item-desc">
						纯前端实现的图片压缩工具，无任何后端存储，安全可靠。
					</div>
				</div>
				<div className="about-prods-item">
					<h2 class="about-prods-item-title">证件照生成</h2>
					<div class="about-prods-item-desc">
						直接嵌入的<a href="https://swanhub.co/ZeYiLin/HivisionIDPhotos/demo" target="_blank">三方开源项目</a>，感谢作者。
					</div>
				</div>
				<div className="about-prods-item">
					<h2 class="about-prods-item-title">需求建议</h2>
					<div class="about-prods-item-desc">
						如有任何需求或建议请<a href="mailto:rushi_wowen@163.com">联系作者</a>。
					</div>
				</div>
			</div>
			<button className="add-to-favorites" onClick={addToFavorites}>加入收藏</button>
		</section>
	);
}
