import cases from 'jest-in-case';

import plugin from '../../';
import {
  getHTML,
  getSpotifyIFrameSrc,
  shouldTransform,
} from '../../transformers/Spotify';

import { cache, getMarkdownASTForFile, parseASTToMarkdown } from '../helpers';

cases(
  'url validation',
  ({ url, valid }) => {
    expect(shouldTransform(url)).toBe(valid);
  },
  {
    'non-Spotify url': {
      url: 'https://not-a-spotify-url.com',
      valid: false,
    },
    "non-Spotify url ending with 'spotify.com'": {
      url: 'https://this-is-not-spotify.com',
      valid: false,
    },
    "api url having '/album/'": {
      url: 'https://api.spotify.com/album/1DFixLWuPkv3KT3TnV35m3',
      valid: false,
    },
    'embed album url': {
      url: 'https://open.spotify.com/embed/album/254Y0CD07dB40q84db89EB',
      valid: false,
    },
    'embed artist url': {
      url: 'https://open.spotify.com/embed/artist/0QaSiI5TLA4N7mcsdxShDO',
      valid: false,
    },
    'embed episode url': {
      url:
        'https://open.spotify.com/embed-podcast/episode/0j9RE1H47GSmBnRqOtf1dx',
      valid: false,
    },
    'embed playlist url': {
      url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5wDmLW735Yd',
      valid: false,
    },
    'embed show url': {
      url: 'https://open.spotify.com/embed-podcast/show/7GkO2poedjbltWT5lduL5w',
      valid: false,
    },
    'embed track url': {
      url: 'https://open.spotify.com/embed/track/0It2bnTdLl2vyymzOkBI3L',
      valid: false,
    },
    'album url': {
      url: 'https://open.spotify.com/album/254Y0CD07dB40q84db89EB',
      valid: true,
    },
    'artist url': {
      url: 'https://open.spotify.com/artist/0QaSiI5TLA4N7mcsdxShDO',
      valid: true,
    },
    'episode url': {
      url: 'https://open.spotify.com/episode/0j9RE1H47GSmBnRqOtf1dx',
      valid: true,
    },
    'playlist url': {
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX5wDmLW735Yd',
      valid: true,
    },
    'show url': {
      url: 'https://open.spotify.com/show/7GkO2poedjbltWT5lduL5w',
      valid: true,
    },
    'track url': {
      url: 'https://open.spotify.com/track/0It2bnTdLl2vyymzOkBI3L',
      valid: true,
    },
  }
);

cases(
  'getSpotifyIFrameSrc',
  ({ url, iframe }) => {
    expect(getSpotifyIFrameSrc(url)).toBe(iframe);
  },
  {
    'album url': {
      url: 'https://open.spotify.com/album/254Y0CD07dB40q84db89EB',
      iframe: 'https://open.spotify.com/embed/album/254Y0CD07dB40q84db89EB',
    },
    'artist url': {
      url: 'https://open.spotify.com/artist/0QaSiI5TLA4N7mcsdxShDO',
      iframe: 'https://open.spotify.com/embed/artist/0QaSiI5TLA4N7mcsdxShDO',
    },
    'episode url': {
      url: 'https://open.spotify.com/episode/0j9RE1H47GSmBnRqOtf1dx',
      iframe:
        'https://open.spotify.com/embed-podcast/episode/0j9RE1H47GSmBnRqOtf1dx',
    },
    'playlist url': {
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX5wDmLW735Yd',
      iframe: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5wDmLW735Yd',
    },
    'show url': {
      url: 'https://open.spotify.com/show/7GkO2poedjbltWT5lduL5w',
      iframe:
        'https://open.spotify.com/embed-podcast/show/7GkO2poedjbltWT5lduL5w',
    },
    'track url': {
      url: 'https://open.spotify.com/track/0It2bnTdLl2vyymzOkBI3L',
      iframe: 'https://open.spotify.com/embed/track/0It2bnTdLl2vyymzOkBI3L',
    },
  }
);

test('Gets the correct Spotify iframe', () => {
  const html = getHTML('https://open.spotify.com/track/0It2bnTdLl2vyymzOkBI3L');

  expect(html).toMatchInlineSnapshot(
    `"<iframe src=\\"https://open.spotify.com/embed/track/0It2bnTdLl2vyymzOkBI3L\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>"`
  );
});

test('Plugin can transform Spotify links', async () => {
  const markdownAST = getMarkdownASTForFile('Spotify');

  const processedAST = await plugin({ cache, markdownAST });

  expect(parseASTToMarkdown(processedAST)).toMatchInlineSnapshot(`
    "<https://not-a-spotify-url.com>

    <https://this-is-not-spotify.com>

    <https://api.spotify.com/album/1DFixLWuPkv3KT3TnV35m3>

    <https://open.spotify.com/embed/album/254Y0CD07dB40q84db89EB>

    <https://open.spotify.com/embed/artist/0QaSiI5TLA4N7mcsdxShDO>

    <https://open.spotify.com/embed-podcast/episode/0j9RE1H47GSmBnRqOtf1dx>

    <https://open.spotify.com/embed/playlist/37i9dQZF1DX5wDmLW735Yd>

    <https://open.spotify.com/embed-podcast/show/7GkO2poedjbltWT5lduL5w>

    <https://open.spotify.com/embed/track/0It2bnTdLl2vyymzOkBI3L>

    <iframe src=\\"https://open.spotify.com/embed/album/254Y0CD07dB40q84db89EB\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>

    <iframe src=\\"https://open.spotify.com/embed/artist/0QaSiI5TLA4N7mcsdxShDO\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>

    <iframe src=\\"https://open.spotify.com/embed-podcast/episode/0j9RE1H47GSmBnRqOtf1dx\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>

    <iframe src=\\"https://open.spotify.com/embed/playlist/37i9dQZF1DX5wDmLW735Yd\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>

    <iframe src=\\"https://open.spotify.com/embed-podcast/show/7GkO2poedjbltWT5lduL5w\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>

    <iframe src=\\"https://open.spotify.com/embed/track/0It2bnTdLl2vyymzOkBI3L\\" width=\\"100%\\" height=\\"380\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allow=\\"encrypted-media\\"></iframe>
    "
  `);
});
