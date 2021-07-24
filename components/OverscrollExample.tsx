import * as React from 'react';
import Reanimated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { clamp } from 'react-native-redash';
import { constraints, ts } from '../utils/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const LaptopImg = require('../img/laptop.jpeg');

export const OverscrollExample: React.FC = () => {
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const scrollYInternal = React.useRef(0);
  const updateInternalScrollY = (y: number) => (scrollYInternal.current = y);

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const scrollRef = React.useRef<ScrollView>(null);
  const spinnerReloadProgress = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler(evt => {
    scrollY.value = evt.contentOffset.y;
    runOnJS(updateInternalScrollY)(evt.contentOffset.y);
  });

  // Header image: pin top to overscroll top.
  const animatedHeaderImgStyle = useAnimatedStyle(() => {
    return {
      top: clamp(scrollY.value, -1000, 0),
    };
  });

  // Animate in the header background
  const animatedHeaderBackground = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [HEADER_BG_THRESHOLD - 30, HEADER_BG_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  // Header buttons: animate color. Duplicate because each element needs its own
  //   style object.
  const animatedHeaderButtonTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(scrollY.value, [0, 30], [white, purple]),
    };
  });
  const animatedHeaderButtonTextStyle2 = useAnimatedStyle(() => {
    return {
      color: interpolateColor(scrollY.value, [0, 30], [white, purple]),
    };
  });

  // Header title... Fade it in, add a little translateY too.
  const animatedHeaderTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [HEADER_BG_THRESHOLD + 10, HEADER_BG_THRESHOLD + 30],
        [0, 1],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [HEADER_BG_THRESHOLD + 10, HEADER_BG_THRESHOLD + 30],
            [7, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  // To make spinner spin, we animate the strokeDashoffset.
  const animSpinnerProps = useAnimatedProps(() => {
    return {
      strokeDasharray: SPINNER_DASH_MAX,
      strokeDashoffset:
        interpolate(
          scrollY.value,
          [PTR_THRESHOLD, 0],
          [0, SPINNER_DASH_MAX],
          Extrapolate.CLAMP,
        ) + spinnerReloadProgress.value,
    };
  });
  // Fade spinner in based on overscroll.
  const animSpinnerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [PTR_THRESHOLD / 2, 0],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  React.useEffect(() => {
    // Dummy logic: if we start refreshing, set a timeout to turn it off.
    if (isRefreshing) {
      let isSubbed = true;

      setTimeout(() => isSubbed && setIsRefreshing(false), 3000);

      return () => {
        isSubbed = false;
      };
    }
    // When fake refresh is turned off, reset some values and scroll
    //  the scrollview back into place.
    else {
      scrollRef?.current?.scrollTo({
        y: isRefreshing ? PTR_THRESHOLD : 0,
        animated: true,
      });
      cancelAnimation(spinnerReloadProgress);
      spinnerReloadProgress.value = withTiming(0, { duration: 300 });
    }
  }, [isRefreshing, spinnerReloadProgress]);

  // Spinner progress, gets called on drag end - and recursively to create loop effect.
  const startSpinnerReloadProgress = (shouldReset: boolean) => {
    if (shouldReset) {
      spinnerReloadProgress.value = SPINNER_DASH_MAX;
    }

    spinnerReloadProgress.value = withTiming(
      shouldReset ? 0 : -SPINNER_DASH_MAX,
      {
        duration: 1000,
      },
      isFinished => {
        if (isFinished) {
          runOnJS(startSpinnerReloadProgress)(!shouldReset);
        }
      },
    );
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <View style={ts('bg:gray-900', 'flex:1')}>
        <Reanimated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          // @ts-ignore
          ref={scrollRef}
          onScrollEndDrag={() => {
            if (scrollYInternal.current <= PTR_THRESHOLD) {
              setIsRefreshing(true);
              scrollRef?.current?.scrollTo({
                y: PTR_THRESHOLD,
                animated: true,
              });
              startSpinnerReloadProgress(false);
            }
          }}
          scrollToOverflowEnabled>
          <Reanimated.View style={{ height: IMG_H }}>
            <AnimatedFastImage
              source={LaptopImg}
              style={[
                ts('absolute', 'inset-x:0', 'bottom:0'),
                animatedHeaderImgStyle,
              ]}
              resizeMode="cover">
              <View
                style={[
                  ts('absolute', 'inset-x:0', 'top:0', 'items:center'),
                  { paddingTop: insets.top },
                ]}
                pointerEvents="none">
                <Svg
                  width={30}
                  height={(417 / 389) * 30}
                  viewBox="0 0 389 417"
                  fill="none">
                  <AnimatedPath
                    d="M185 30C281.098 30 359 107.902 359 204C359 300.098 281.098 387 185 387C88.9025 387 30.5 334.598 30.5 238.5C30.5 186.247 95 110 185 127.5"
                    stroke={purple}
                    strokeWidth="60"
                    animatedProps={animSpinnerProps}
                    // @ts-ignore
                    style={animSpinnerStyle}
                  />
                </Svg>
              </View>
            </AnimatedFastImage>
          </Reanimated.View>
          <View style={ts('px:4', 'pb:4', '-mt:24')}>
            <Text
              style={ts('color:white', 'font-weight:bold', 'text:2xl', 'mb:1')}>
              New Laptop
            </Text>
            <OutForDeliveryBadge />
            {new Array(5).fill(null).map((_, i) => (
              <View
                key={i}
                style={ts(
                  'bg:gray-900',
                  'mb:3',
                  'rounded:md',
                  'border:1',
                  'border-color:gray-300',
                )}>
                <View style={ts('p:2', 'border-b:1', 'border-color:gray-300')}>
                  <Text
                    style={ts('font-weight:bold', 'color:white', 'text:base')}>
                    Detail {i + 1}
                  </Text>
                </View>
                <View
                  style={ts(
                    'p:2',
                    'border-b:1',
                    'border-color:gray-300',
                    i % 2 === 0 ? 'h:24' : 'h:36',
                    'justify:center',
                    'items:center',
                  )}>
                  <Text
                    style={ts('color:white', 'text:sm', 'font-weight:thin')}>
                    Foobar or something
                  </Text>
                </View>
                <View style={ts('p:2', 'items:center')}>
                  <Text
                    style={ts('color:white', 'font-weight:bold', 'text:xs')}>
                    Show details
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Reanimated.ScrollView>
        <Reanimated.View
          style={[
            ts('absolute', 'inset-x:0', 'top:0'),
            { paddingTop: insets.top },
          ]}>
          <Reanimated.View
            style={[
              ts(
                'absolute',
                'inset:0',
                'bg:gray-900',
                'border-b:hairline',
                'border-color:gray-700',
              ),
              animatedHeaderBackground,
            ]}
          />
          <View style={ts('p:2', 'flex:row', 'justify:between')}>
            <Reanimated.Text
              style={[ts('text:sm'), animatedHeaderButtonTextStyle]}>
              Back
            </Reanimated.Text>
            <Reanimated.Text
              style={[
                ts('font-weight:bold', 'color:white'),
                animatedHeaderTitleStyle,
              ]}>
              New Laptop
            </Reanimated.Text>
            <Reanimated.Text
              style={[ts('text:sm'), animatedHeaderButtonTextStyle2]}>
              info
            </Reanimated.Text>
          </View>
        </Reanimated.View>
      </View>
    </React.Fragment>
  );
};

const AnimatedFastImage = Reanimated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);
const AnimatedPath = Reanimated.createAnimatedComponent(Path);

const OutForDeliveryBadge = () => (
  <View style={ts('flex:row', 'mb:3')}>
    <View
      style={ts(
        'bg:gray-900',
        'px:2',
        'py:1',
        'rounded:full',
        'border:1',
        'border-color:purple-300',
      )}>
      <Text style={ts('color:purple-300', 'text:sm')}>Out for delivery</Text>
    </View>
    <View style={ts('flex:grow')} />
  </View>
);

const white = constraints.colors.white;
const purple = constraints.colors['purple-300'];
const IMG_H = 200;
const HEADER_BG_THRESHOLD = 80;
const PTR_THRESHOLD = -70;
const SPINNER_DASH_MAX = 1000;
