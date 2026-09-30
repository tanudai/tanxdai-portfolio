// One composition per service film. Renders the same Film component as the site, with t = frame / fps.
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import Film, { CANVAS, timeline } from '../../src/film/Film.jsx';
import { films } from '../../src/service-films.js';
import '../../src/film/film.css';

loadFont('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });

const FPS = 30;
const WIDTH = 1600, HEIGHT = 1000;

function FilmVideo({ id }) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const film = films[id];
  return <AbsoluteFill style={{ background: '#000' }}>
    <div style={{ width: CANVAS.width, height: CANVAS.height, transform: `scale(${width / CANVAS.width})`, transformOrigin: '0 0' }}>
      <Film film={film} t={(frame / fps) * 1000} />
    </div>
  </AbsoluteFill>;
}

export function Root() {
  return <>{Object.values(films).map(film => <Composition key={film.id} id={`film-${film.id}`} component={FilmVideo}
    durationInFrames={Math.ceil((timeline(film).total / 1000) * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ id: film.id }} />)}</>;
}
