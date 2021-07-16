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
} from 'react-native';
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { Spacer } from './Spacer';

export const PressableExample: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      {[
        MyTouchableOpacity,
        MyTouchableOpacityAnimated,
        MyTouchableOpacityReanimated,
      ].map((TouchableOpacity, i) => (
        <React.Fragment key={i}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#ededed',
            }}
            onPress={() => null}>
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
              <Text style={{ fontWeight: '700', fontSize: 24 }}>
                Daily Photo
              </Text>
              <Text style={{ fontWeight: '300', fontSize: 13 }}>
                From Source Unsplash
              </Text>
            </View>
          </TouchableOpacity>
          <Spacer height={32} />
        </React.Fragment>
      ))}
    </SafeAreaView>
  );
};

type MyTouchableOpacityProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

/**
 * Basic version
 */
const MyTouchableOpacity: React.FC<MyTouchableOpacityProps> = ({
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
const MyTouchableOpacityAnimated: React.FC<MyTouchableOpacityProps> = ({
  style,
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
        Animated.timing(pressInProgress, {
          toValue: 1,
          useNativeDriver: true,
          duration: 150,
        }).start();
        rest?.onPressIn?.(evt);
      }}
      onPressOut={evt => {
        Animated.timing(pressInProgress, {
          toValue: 0,
          useNativeDriver: true,
          duration: 150,
        }).start();
        rest?.onPressOut?.(evt);
      }}
      style={[...(Array.isArray(style) ? style : [style]), { opacity }]}
      {...rest}
    />
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Animated with Reanimated 2
 */
const MyTouchableOpacityReanimated: React.FC<MyTouchableOpacityProps> = ({
  style,
  ...rest
}) => {
  const pressInProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        pressInProgress.value,
        [0, 1],
        [1, 0.3],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <ReanimatedPressable
      onPressIn={evt => {
        pressInProgress.value = withTiming(1, { duration: 150 });
        rest?.onPressIn?.(evt);
      }}
      onPressOut={evt => {
        pressInProgress.value = withTiming(0, { duration: 150 });
        rest?.onPressOut?.(evt);
      }}
      style={[...(Array.isArray(style) ? style : [style]), animatedStyle]}
      {...rest}
    />
  );
};

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);
