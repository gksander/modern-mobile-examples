import * as React from 'react';
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Reanimated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { ts } from '../utils/styles';
import { BetterImage } from './BetterImage';
import { Spacer } from './Spacer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clamp } from 'react-native-redash';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export const ScrollHandleExample: React.FC = () => {
  const insets = useSafeAreaInsets();

  const scrollRef = React.useRef<FlatList>(null);
  const scrollY = useSharedValue(0);
  const containerHeight = useSharedValue(1);
  const contentHeight = useSharedValue(1);
  // For when dragging handle
  const isDraggingHandle = useSharedValue(false);
  const manualHandleTranslateY = useSharedValue(0);

  const scrollProgress = useDerivedValue(() => {
    return clamp(
      scrollY.value / (contentHeight.value - containerHeight.value || 1),
      0,
      1,
    );
  });

  const handleTranslateY = useDerivedValue(
    () => scrollProgress.value * (containerHeight.value - 4 * HANDLE_RADIUS),
  );

  const onScroll = useAnimatedScrollHandler(evt => {
    scrollY.value = evt.contentOffset.y;
  });

  const setOffset = (offset: number) => {
    scrollRef?.current?.scrollToOffset({
      offset,
      animated: false,
    });
  };

  const onHandlePan = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startScrollY: number; startTranslateY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startScrollY = scrollY.value;
      ctx.startTranslateY = handleTranslateY.value;

      manualHandleTranslateY.value = handleTranslateY.value;
      isDraggingHandle.value = true;
    },
    onActive: (evt, ctx) => {
      manualHandleTranslateY.value = clamp(
        ctx.startTranslateY + evt.translationY,
        0,
        containerHeight.value - 4 * HANDLE_RADIUS,
      );

      const newScrollY =
        (manualHandleTranslateY.value /
          (containerHeight.value - 4 * HANDLE_RADIUS)) *
        (contentHeight.value - containerHeight.value);

      runOnJS(setOffset)(newScrollY);
    },
    onEnd: () => {
      isDraggingHandle.value = false;
    },
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      width: 2 * HANDLE_RADIUS,
      height: 2 * HANDLE_RADIUS,
      borderRadius: HANDLE_RADIUS,
      transform: [
        {
          translateY: isDraggingHandle.value
            ? manualHandleTranslateY.value
            : handleTranslateY.value,
        },
      ],
    };
  });

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
      <View style={ts('p:3', 'bg:white')}>
        <Text style={ts('text:xl', 'font-weight:bold', 'color:gray-800')}>
          My list of cool stuff!
        </Text>
        <Text style={ts('text:sm', 'color:gray-600')}>
          Actually, the content isn't cool, but check out the scroll handle.
        </Text>
      </View>
      <View style={[ts('flex:grow'), { marginBottom: insets.bottom }]}>
        <AnimatedFlatList
          ref={scrollRef}
          data={ITEMS}
          // @ts-ignore
          renderItem={renderItem}
          // @ts-ignore
          keyExtractor={keyExtractor}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(_, height) => {
            contentHeight.value = height;
          }}
          onLayout={evt => {
            containerHeight.value = evt.nativeEvent.layout.height;
          }}
          showsVerticalScrollIndicator={false}
        />
        <PanGestureHandler onGestureEvent={onHandlePan}>
          <Reanimated.View
            style={[
              ts('absolute', 'right:0', 'top:0', 'bg:red-600', 'rounded:full'),
              animatedHandleStyle,
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
};

/**
 * Scroll Handle utils
 */
const HANDLE_RADIUS = 20;

/**
 * Boring FlatList Item stuff
 */
const AnimatedFlatList = Reanimated.createAnimatedComponent(FlatList);

const ITEMS = Array(60)
  .fill(null)
  .map((_, i) => i);

const renderItem: ListRenderItem<number> = () => <Item />;
const keyExtractor = (item: number) => String(item);

const Item: React.FC = () => {
  const sig = React.useRef(Math.ceil(1000 * Math.random()));

  return (
    <View style={ts('flex:row', 'p:3')}>
      <View style={ts('rounded:full', 'shadow:base', 'w:16', 'h:16')}>
        <BetterImage
          source={{
            uri: `https://source.unsplash.com/random/500x500?sig=${sig.current}`,
          }}
          style={ts('w:full', 'h:full', 'rounded:full')}
          resizeMode="cover"
        />
      </View>
      <Spacer width={16} />
      <View style={ts('flex:grow', 'pt:1')}>
        <Text style={ts('font-weight:bold', 'color:gray-800')}>
          Item with signature {sig.current}
        </Text>
        <Text style={ts('text:sm', 'color:gray-700')}>
          Filler text, you know what it is.
        </Text>
      </View>
    </View>
  );
};
