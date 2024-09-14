import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header';
import { About } from './pages/About';
import { ImgCompress } from './pages/ImgCompress';
import { NotFound } from './pages/_404.jsx';
import { IdCard } from './pages/IdCard';
import './styles/index.less';

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={ImgCompress} />
          <Route path="/idcard" component={IdCard} />
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
