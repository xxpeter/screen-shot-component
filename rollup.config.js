import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/screen-shot-component.vue',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'ScreenShotComponent',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    vue({
      css: false,
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
    }),
  ],
};
