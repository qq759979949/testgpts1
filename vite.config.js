import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import VueSetupExtend from 'vite-plugin-vue-setup-extend'; //方便定义组件的name命名
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const base = './';
  const outDir = 'pdc-pidim';
  // const proxyTarget = 'http://internal.pisx.com:4201';
  const proxyTarget = 'http://192.168.3.231:9100';

  return {
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      VueSetupExtend(),
      // vue3 api自动导入
      AutoImport({
        // 适用的文件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: ['vue', 'vue-router'],
        // 可以选择auto-import.d.js生成的位置，使用ts建议设置为'/src/auto-import.d.js'不然会自动生成在根目录
        dts: 'src/auto-import.d.js',
        // 生成全局声明文件，给eslint用
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // 避免自动引入vue3 api后页面报未定义的错误
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()], //使用element plus
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 全局变量
          // additionalData: '@import "./src/assets/style/global-variables.scss";',
          // element-plus升级到v2需要改成以下写法
          additionalData: `@use "./src/assets/sass/variables.scss" as *;`,
        },
      },
    },
    server: {
      port: 3002,
      open: true,
      fs: {
        // 允许为项目根目录的上一级提供服务
        allow: ['../../'],
      },
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
        '/oauth': {
          target: proxyTarget,
          changOrigin: true,
          rewrite: (path) => path.replace(/^\/oauth/, '/oauth'),
        },
        '/project': {
          target: proxyTarget,
          changOrigin: true,
          rewrite: (path) => path.replace(/^\/project\//, '/project'),
        },
        '/v1': {
          //portal管理
          target: proxyTarget,
          changeOrigin: true,
        },
        '/system': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/plmPortal': {
          target: proxyTarget,
          changOrigin: true,
        },
      },
    },
    base,
    build: {
      outDir,
    },
  };
});
