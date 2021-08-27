import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

// 웹팩 설정 
const config: webpack.Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 바벨이 처리할 확장자 목록 
    alias: { // 해두면 편함 
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // client.tsx가 메인 파일임 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', // ts나 tsx파일을 바벨로더가 js로 바꿔줌 
        options: { // 바벨에 대한 설정 
          presets: [ // 아래 명령어를 통해, 왠만한 브라우저에서 다 돌아가도록 설정해줌 
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion'],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'], // 바벨이 css도 js로 바꿀 수 있는 이유가 얘네 둘 때문임 
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // 이걸넣으면 process.env.NODE_ENV를 프론트에서도 접근할 수 있음 (원래는 백 에서만 가능)
  ],
  output: { // 결과물은 웹팩 `실행`하면 생김
    path: path.join(__dirname, 'dist'), // __dirname은 alecture임
    filename: '[name].js', // 26번째 줄에 있는게 [name]에 들어감 --> app.js
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router할때 필요한것 
    port: 3090, // 프론트: 3090, 백: 3095
    publicPath: '/dist/',
    proxy: {
      '/api/': { // 프론트엔드에서 /api 로 보내는 요청은,
        target: 'http://localhost:3095', // 주소를 3095로 바꿔서 보내겠다 
        changeOrigin: true,
      },
    },
  },
};

// 개발환경일때 쓸 플러그인
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
// 개발환경이 아닐때 쓸 플러그인 
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
