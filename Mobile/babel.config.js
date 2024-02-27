module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ["module-resolver",
        {
          alias: {
            "@components": "./components",
            "@assets": "./assets",
            "@store": "./store",
            "@types": "./types",
            "@dataRequests": "./dataRequests",
            "@features": "./features",
            "@configs": "./configs",
          },
        },
      ]
    ]
  };
};
