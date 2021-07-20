import * as React from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  SafeAreaView,
  StyleProp,
  Text,
  View,
  ViewStyle,
  Animated,
  StyleSheet,
} from 'react-native';
import { Spacer } from './Spacer';

export const PressableExample: React.FC = () => {
  // Inner content
  const content = (
    <React.Fragment>
      <Image
        source={{ uri: 'https://source.unsplash.com/daily' }}
        style={{
          width: 75,
          height: 75,
          resizeMode: 'cover',
          borderRadius: 75 / 2,
        }}
      />
      <Spacer width={16} />
      <View>
        <Text style={{ fontWeight: '700', fontSize: 24 }}>Daily Photo</Text>
        <Text style={{ fontWeight: '300', fontSize: 13 }}>
          From Source Unsplash
        </Text>
      </View>
    </React.Fragment>
  );

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <PlainJaneTouchableOpacity style={styles.container} onPress={() => null}>
        {content}
      </PlainJaneTouchableOpacity>
      <Spacer height={50} />
      <AnimatedTouchableOpacity style={styles.container} onPress={() => null}>
        {content}
      </AnimatedTouchableOpacity>
    </SafeAreaView>
  );
};

type MyTouchableOpacityProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

/**
 * Basic version
 */
const PlainJaneTouchableOpacity: React.FC<MyTouchableOpacityProps> = ({
  style,
  ...rest
}) => {
  return (
    <Pressable
      style={args => [
        ...(Array.isArray(style) ? style : [style]),
        args.pressed && { opacity: 0.3 },
      ]}
      {...rest}
    />
  );
};

/**
 * Animated with RN Animated API
 */
const AnimatedTouchableOpacity: React.FC<MyTouchableOpacityProps> = ({
  style,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const pressInProgress = React.useRef(new Animated.Value(0)).current;

  const opacity = pressInProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <AnimatedPressable
      onPressIn={evt => {
        onPressIn?.(evt);
        Animated.timing(pressInProgress, {
          toValue: 1,
          useNativeDriver: true,
          duration: 150,
        }).start();
      }}
      onPressOut={evt => {
        onPressOut?.(evt);
        Animated.timing(pressInProgress, {
          toValue: 0,
          useNativeDriver: true,
          duration: 150,
        }).start();
      }}
      style={[...(Array.isArray(style) ? style : [style]), { opacity }]}
      {...rest}
    />
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ededed',
  },
});
