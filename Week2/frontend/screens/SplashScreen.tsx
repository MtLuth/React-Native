import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator'; // Adjust the import path as needed
import {RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
}

const SplashScreen: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    setTimeout(async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        navigation.replace('Home');
      } else {
        navigation.replace('Onboard');
      }
    }, 5000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào, em là Mai Tan Tai</Text>
      <Text style={styles.subtitle}>Đang tải...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Màu nền cho splash
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20, // Điều chỉnh vị trí lên xuống của chữ
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20, // Điều chỉnh vị trí xuống gần cuối màn hình
  },
});

export default SplashScreen;
