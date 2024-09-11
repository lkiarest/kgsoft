import { useLocation } from 'preact-iso';
import './index.less';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<a className="logo" href="/">KgSoft.cn</a>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					图片压缩
				</a>
				<a href="/about" class={url == '/about' && 'active'}>
					关于
				</a>
			</nav>
		</header>
	);
}
