import React from 'react';
import { Platform } from 'react-native';

let LottieView;

if (Platform.OS === 'web') {
  const { DotLottiePlayer } = require('@dotlottie/react-player');
  LottieView = ({ source, autoPlay, loop, style }) => (
    <DotLottiePlayer
      src={source}
      autoplay={autoPlay}
      loop={loop}
      style={style}
    />
  );
} else {
  LottieView = require('lottie-react-native');
}

export default LottieView;