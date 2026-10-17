import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

// Let the video import the real Android files (.java, .xml, .gradle) as plain text,
// so the code on screen always matches ../android-app
Config.overrideWebpackConfig((config) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...(config.module?.rules ?? []),
      {test: /\.(java|xml|gradle)$/, type: 'asset/source'},
    ],
  },
}));
