import * as React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type BetterImageProps = FastImageProps;

export const BetterImage: React.FC<BetterImageProps> = ({
  style,
  onLoad,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLoaded ? 1 : 0, { duration: 300 }),
      transform: [{ scale: withTiming(isLoaded ? 1 : 0.8, { duration: 300 }) }],
    };
  });

  return (
    <View>
      <AnimatedFastImage
        style={[imageStyle, style]}
        onLoad={evt => {
          onLoad?.(evt);
          setIsLoaded(true);
        }}
        {...rest}
      />
      {!isLoaded && (
        <View style={[StyleSheet.absoluteFill, styles.spinner]}>
          <ActivityIndicator color="#000" />
        </View>
      )}
    </View>
  );
};

const AnimatedFastImage = Reanimated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const styles = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
