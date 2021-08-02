import * as React from 'react';
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  AnimatedLayout,
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeOutDown,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import { constraints, ts } from '../utils/styles';
import { BetterImage } from './BetterImage';

type SearchBarExampleProps = {};

export const SearchBarExample: React.FC<SearchBarExampleProps> = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textRef = React.useRef<TextInput>(null);

  return (
    <React.Fragment>
      <AnimatedLayout style={ts('flex:1')}>
        <View style={ts('flex:1')}>
          {/* Header */}
          <View style={ts('bg:black', 'py:2')}>
            <SafeAreaView>
              <Animated.View
                style={ts('flex:row', 'items:center', 'px:2')}
                layout={Layout.duration(200).easing(Easing.ease)}>
                {!isFocused && (
                  <AnimatedTouchable
                    style={ts('mr:2')}
                    entering={FadeInLeft.duration(200).easing(Easing.ease)}
                    exiting={FadeOutLeft.duration(200).easing(Easing.ease)}>
                    <Icon
                      name="user-plus"
                      size={18}
                      color={constraints.colors.white}
                    />
                  </AnimatedTouchable>
                )}
                <Animated.View
                  layout={Layout.duration(200).easing(Easing.ease)}
                  style={ts(
                    'flex:1',
                    'flex:row',
                    'items:center',
                    'rounded:base',
                    'bg:gray-800',
                  )}>
                  <View style={ts('h:full', 'p:2', 'pr:0')}>
                    <Icon
                      name="search"
                      color={constraints.colors['gray-500']}
                    />
                  </View>
                  <TextInput
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    style={ts('p:2', 'flex:grow', 'color:white')}
                    ref={textRef}
                    placeholder="Search"
                    placeholderTextColor={constraints.colors['gray-500']}
                  />
                </Animated.View>
                {isFocused && (
                  <AnimatedTouchable
                    style={ts('ml:2')}
                    entering={FadeInDown.duration(200).easing(Easing.ease)}
                    exiting={FadeOutDown.duration(100).easing(Easing.ease)}
                    onPress={() => {
                      textRef?.current?.blur?.();
                    }}>
                    <Text style={ts('color:white', 'text:sm')}>Cancel</Text>
                  </AnimatedTouchable>
                )}
              </Animated.View>
            </SafeAreaView>
          </View>

          {/* Body */}
          <View style={ts('flex:1', 'bg:gray-500')}>
            <FlatList
              data={IDS}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              numColumns={2}
            />

            {isFocused && (
              <Animated.View
                style={ts('absolute', 'inset:0', 'bg:black', 'py:24')}
                entering={FadeInDown.duration(200).easing(Easing.ease)}
                exiting={FadeOutDown.duration(200).easing(Easing.ease)}>
                <Text
                  style={ts(
                    'color:white',
                    'text-align:center',
                    'text:xl',
                    'font-weight:bold',
                  )}>
                  SEARCH RESULTS
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </AnimatedLayout>

      <StatusBar barStyle="light-content" />
    </React.Fragment>
  );
};

const IDS = Array(20)
  .fill(null)
  .map(_ => 1 + Math.floor(10000 * Math.random()));

const renderItem: ListRenderItem<number> = ({ item }) => {
  return (
    <View style={{ flex: 0.5 }}>
      <View
        style={[
          ts('w:full', 'aspect:1'),
          { padding: StyleSheet.hairlineWidth },
        ]}>
        <BetterImage
          source={{
            uri: `https://source.unsplash.com/random/640x320?sig=${item}`,
          }}
          style={ts('w:full', 'h:full')}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};
const keyExtractor = (item: number) => String(item);

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
