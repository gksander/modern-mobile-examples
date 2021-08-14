import * as React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import Reanimated, {
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
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
import Svg, { Path } from 'react-native-svg';

export const ScrollHandleExample: React.FC = () => {
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<FlatList>();
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

  const handleTranslateYFromScroll = useDerivedValue(
    () => scrollProgress.value * (containerHeight.value - 4 * HANDLE_RADIUS),
  );

  const onScroll = useAnimatedScrollHandler(evt => {
    scrollY.value = evt.contentOffset.y;
  });

  const onHandlePan = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startScrollY: number; startTranslateY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startScrollY = scrollY.value;
      ctx.startTranslateY = handleTranslateYFromScroll.value;

      manualHandleTranslateY.value = handleTranslateYFromScroll.value;
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

      // @ts-ignore
      scrollTo(scrollRef, 0, newScrollY, false);
    },
    onEnd: () => {
      isDraggingHandle.value = false;
    },
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    const isHandleVisible = !(!isDraggingHandle.value && scrollY.value <= 0);

    return {
      width: 2 * HANDLE_RADIUS,
      height: 2 * HANDLE_RADIUS,
      borderRadius: HANDLE_RADIUS,
      opacity: withSpring(isHandleVisible ? 1 : 0, { mass: 0.3 }),
      transform: [
        {
          translateY: isDraggingHandle.value
            ? manualHandleTranslateY.value
            : handleTranslateYFromScroll.value,
        },
        {
          translateX: withSpring(
            isHandleVisible ? HANDLE_HORIZ_SHIFT : 2 * HANDLE_RADIUS,
            { mass: 0.3 },
          ),
        },
        // {
        //   scale: withSpring(isDraggingHandle.value ? 1.3 : 1),
        // },
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
              ts(
                'absolute',
                'right:0',
                'top:0',
                'bg:gray-500',
                'rounded:full',
                'justify:center',
                'items:center',
              ),
              animatedHandleStyle,
            ]}>
            <ArrowIcon size={20} />
          </Reanimated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

/**
 * Scroll Handle utils
 */
const HANDLE_RADIUS = 20;
const HANDLE_HORIZ_SHIFT = 10;

/**
 * Boring FlatList Item stuff
 */
const AnimatedFlatList = Reanimated.createAnimatedComponent(FlatList);

const ITEMS = Array(100)
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

const ArrowIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size / 2} height={size} viewBox="0 0 256 512">
    <Path
      fill="white"
      d="M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z"
    />
  </Svg>
);
