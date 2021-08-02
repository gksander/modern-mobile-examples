import * as React from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  AnimatedLayout,
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  FadeInLeft,
  FadeOutLeft,
} from 'react-native-reanimated';
import { ts } from '../utils/styles';

type SearchBarExampleProps = {};

export const SearchBarExample: React.FC<SearchBarExampleProps> = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textRef = React.useRef<TextInput>(null);

  return (
    <SafeAreaView style={ts('flex:1')}>
      <View style={ts('flex:1')}>
        <AnimatedLayout>
          <View style={ts('p:2')}>
            {!isFocused && (
              <Animated.View
                style={ts('flex:row', 'justify:between', 'pb:2')}
                entering={FadeIn.duration(200).delay(100)}
                exiting={FadeOut.duration(200)}>
                <Text>BRAND</Text>
                <Text>Account</Text>
              </Animated.View>
            )}
            <Animated.View
              style={ts('flex:row', 'items:center')}
              layout={Layout.duration(200).easing(Easing.ease)}>
              {isFocused && (
                <AnimatedTouchable
                  style={ts('pr:2')}
                  entering={FadeInLeft.duration(200)}
                  exiting={FadeOutLeft.duration(200)}
                  onPress={() => {
                    textRef?.current?.blur?.();
                  }}>
                  <Text>Back</Text>
                </AnimatedTouchable>
              )}
              <AnimatedTextInput
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
                style={ts('border:hairline', 'p:2', 'flex:grow')}
                layout={Layout.duration(200)}
                ref={textRef}
              />
            </Animated.View>
          </View>
        </AnimatedLayout>
      </View>
    </SafeAreaView>
  );
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
