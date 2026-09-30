import { createRoot } from 'react-dom/client';
import FilmPlayer from '../../src/film/FilmPlayer.jsx';

const query = new URLSearchParams(location.search);
const id = query.get('id') || '01';
const at = query.has('at') ? Number(query.get('at')) : undefined;
const width = query.get('w') || '800';

createRoot(document.getElementById('root')).render(<div style={{ width: `${width}px` }}><FilmPlayer id={id} at={at} startDelay={300} /></div>);
