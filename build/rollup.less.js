import less from 'rollup-plugin-less';

export default {
  input: {
    dir: 'packages/theme/src',
  },
  // output: {

  // },
  plugins: [
    less(),
  ],
};
