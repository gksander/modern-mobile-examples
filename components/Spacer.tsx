import * as React from 'react';
import { View, ViewStyle } from 'react-native';

type SpacerProps = {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
};

export const Spacer: React.FC<SpacerProps> = React.memo(({ width, height }) => {
  return <View style={{ width, height }} />;
});
