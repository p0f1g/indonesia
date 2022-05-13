import gulp from 'gulp';
import del from 'del';
import autoprefixer from 'autoprefixer';
import webpackStream from 'webpack-stream';
import newer from 'gulp-newer';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import sortMediaQueries from 'postcss-sort-media-queries';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import svgSprite from 'gulp-svg-sprite';

const { series, parallel, src, dest, watch } = gulp;

const sass = gulpSass(dartSass);

const mode = process.env.MODE || 'development';
const dir = {
  src: 'src/',
  build: 'build/',
};

const postCssPlugins = [
  sortMediaQueries({
    sort: 'mobile-first',
  }),
  autoprefixer(),
  csso({
    restructure: false,
  }),
];

export function compileSass() {
  const fileList = [`${dir.src}/styles/main.scss`];
  return src(fileList, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(mode !== 'development', postcss(postCssPlugins)))
    .pipe(
      dest(`${dir.build}/css`, {
        sourcemaps: mode === 'development' ? '.' : false,
      })
    );
}

export function images() {
  return src(`${dir.src}/img/**/*.{jpg,jpeg,png,gif,svg,webp,avif}`)
    .pipe(newer(`${dir.build}/images`))
    .pipe(
      gulpif(
        mode !== 'development',
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, // 0 to 7
        })
      )
    )
    .pipe(dest(`${dir.build}/images`));
}

export function clearBuildDir() {
  return del([`${dir.build}**/*`]);
}

export function copyFonts() {
  return src(`${dir.src}/fonts/*.{woff,woff2}`).pipe(
    dest(`${dir.build}/fonts`)
  );
}

export function buildJs() {
  return src(`${dir.src}js/main.js`)
    .pipe(
      webpackStream({
        mode,
        devtool: mode === 'development' ? 'inline-source-map' : false,
        output: {
          filename: '[name].js',
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', { targets: 'defaults' }]],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(dest(`${dir.build}js`));
}

export function sprite() {
  return src(`${dir.src}svg-icons/*.svg`)
    .pipe(
      svgSprite({
        mode: {
          inline: true,
          symbol: {
            dest: '.',
            sprite: 'sprite.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  { removeXMLNS: true },
                  { convertPathData: true },
                  { removeViewBox: false },
                ],
              },
            },
          ],
        },
        svg: {
          rootAttributes: {
            style: 'display: none;',
            'aria-hidden': true,
          },
          xmlDeclaration: false,
          doctypeDeclaration: false,
        },
      })
    )
    .pipe(dest(`${dir.src}img/svg`));
}

export const build = series(
  clearBuildDir,
  parallel(compileSass, buildJs, copyFonts, images)
);

export const watchers = () => {
  watch(
    [`${dir.src}styles/**/*.scss`, `${dir.src}components/**/*.scss`],
    { events: ['all'], delay: 100 },
    compileSass
  );

  watch([`${dir.src}js/**/*.js`], { events: ['all'], delay: 100 }, buildJs);

  watch(
    [`${dir.src}img/**/*.{jpg,jpeg,png,gif,svg,webp,avif}`],
    { events: ['all'], delay: 100 },
    images
  );
};

export default series(build, watchers);
