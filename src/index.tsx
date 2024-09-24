import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header';
import { About } from './pages/About';
import { SingleImgCompress } from './pages/ImgCompress/single';
import { MultipleImageCompress } from './pages/ImgCompress/multiple';
import { NotFound } from './pages/_404.jsx';
import { IdCard } from './pages/IdCard';
import { Matting } from './pages/Matting';
import { Rmbg } from './pages/Rmbg';
import './styles/index.less';

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={SingleImgCompress} />
          <Route path="/compress/multiple" component={MultipleImageCompress} />
          <Route path="/idcard" component={IdCard} />
          <Route path="/matting" component={Matting} />
          <Route path="/rmbg" component={Rmbg} />
          <Route path="/about" component={About} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
