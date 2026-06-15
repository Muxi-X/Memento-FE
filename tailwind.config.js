/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}', // 包含 app 目录下所有文件
    './components/**/*.{js,jsx,ts,tsx}', // 包含 components 目录下所有文件
    './src/**/*.{js,jsx,ts,tsx}', // 如果有 src 目录也加上
  ],
  theme: {
    extend: {
      colors: {
        BlueBorder: '#D2E1FF',
        BlueText: '#72B6FF',
        Pinkborder: '#FFCCD2',
        PinkText: '#FFA9BF',
        Purpleborder: '#DCCFFD',
        PurpleText: '#CBA9FF',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 默认样式
  },
};
