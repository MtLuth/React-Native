import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showErrorMessage} from '../utils/ToastMessage';
import {User} from '../models/User';
import {Buffer} from 'buffer';
import {useFocusEffect} from '@react-navigation/native';
const ProfileScreen = ({navigation}: {navigation: any}) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedImage, setSelectedImage] = useState<string>();
  axios.defaults.baseURL = 'http://192.168.1.138:8080/api/v1/';

  useFocusEffect(
    React.useCallback(() => {
      getCurrentUser();
    }, []),
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', {user: currentUser});
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.navigate('Splash');
  };

  // const handleSelectImage = () => {
  //   launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
  //     if (response.didCancel) return;
  //     if (response.errorCode) {
  //       showErrorMessage('Lỗi khi chọn ảnh');
  //       return;
  //     }

  //     const imageUri = response.assets?.[0]?.uri;
  //     setSelectedImage(imageUri);
  //   });
  // };

  const getCurrentUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        console.log('Token:', accessToken);

        const decodedToken = JSON.parse(
          Buffer.from(accessToken.split('.')[1], 'base64').toString(),
        );
        console.log('Decoded Token:', decodedToken);

        const {userId} = decodedToken;
        console.log('UserId:', userId);

        try {
          const response = await axios.get(`/user/${userId}`);
          const user = response.data?.message;
          console.log('User Info:', user);
          setCurrentUser(user);
        } catch (error) {
          showErrorMessage('Lỗi khi lấy thông tin người dùng');
          console.error('Error fetching user information:', error);
        }
      } else {
        console.log('No access token found');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: currentUser?.avatar,
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{currentUser?.fullName}</Text>
      <Text style={styles.email}>{currentUser?.email}</Text>
      <Text style={styles.email}>{currentUser?.phoneNumber}</Text>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.buttonText}>Câp nhật ảnh đại diện</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
