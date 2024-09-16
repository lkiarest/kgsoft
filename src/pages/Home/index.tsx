import useDocumentTitle from '../../hooks/useDocumentTitle';
import './style.less';

export function Home() {
	useDocumentTitle()
	
	return (
		<div class="home">
			Hello
		</div>
	);
}
