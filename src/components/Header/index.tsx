import { useLocation } from 'preact-iso';
import Logo from '../../assets/logo.svg';

import './index.less';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<div className="logo-container">
				<a className="logo" href="/">
				<img src={Logo} alt="" />
					开济在线
				</a>
			</div>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					图片压缩
				</a>
				<a href="/compress/multiple" class={url == '/compress/multiple' && 'active'}>
					批量压缩
				</a>
				<a href="/idcard" class={url == '/idcard' && 'active'}>
					证件照生成
				</a>
				<a href="/about" class={url == '/about' && 'active'}>
					关于
				</a>
			</nav>
		</header>
	);
}
