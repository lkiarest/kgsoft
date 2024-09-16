import useDocumentTitle from "../hooks/useDocumentTitle";

export function NotFound() {
	useDocumentTitle()

	return (
		<section>
			<h1>404: Not Found</h1>
			<p>It's gone :(</p>
		</section>
	);
}
