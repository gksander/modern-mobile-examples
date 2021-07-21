import * as React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ts } from '../utils/styles';
import { BetterImage } from './BetterImage';

export const BetterImageExample: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [data, setData] = React.useState(generateRandomIds());
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(generateRandomIds());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingTop: insets.top }}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

const generateRandomIds = () =>
  Array(60)
    .fill(null)
    .map((_, i) => i * 100 + Math.floor(100 * Math.random()));

const renderItem: ListRenderItem<number> = ({ item }) => <Item sig={item} />;
const keyExtractor = (item: number) => `${item}`;

const Item: React.FC<{ sig: number }> = ({ sig }) => {
  return (
    <View>
      <View style={ts('w:full', 'aspect:2-1')}>
        <BetterImage
          source={{
            uri: `https://source.unsplash.com/random/640x320?sig=${sig}`,
          }}
          style={ts('w:full', 'h:full')}
          resizeMode="cover"
        />
      </View>
      <View style={ts('p:3')}>
        <Text style={ts('font-weight:bold', 'color:gray-800', 'mb:1')}>
          Item with signature {sig}
        </Text>
        <Text style={ts('text:xs', 'color:gray-900', 'font-weight:light')}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias atque
          cupiditate deleniti dicta distinctio dolore est harum inventore ipsa
          maxime mollitia natus, placeat provident quam qui reiciendis repellat
          sed unde.
        </Text>
      </View>
    </View>
  );
};
