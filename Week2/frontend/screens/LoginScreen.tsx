import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';
import {showErrorMessage, showSuccessMessage} from '../utils/ToastMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'http://192.168.1.138:8080';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });
      showSuccessMessage(response?.data.message);
      await AsyncStorage.setItem('accessToken', response?.data.token);
      navigation.navigate('Home');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response?.data.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.customButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.customButtonText}>Forgot Password</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customButton: {
    backgroundColor: '#fff', // Nền màu trắng
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  customButtonText: {
    color: '#000', // Chữ màu đen
    fontSize: 16,
  },
});

export default LoginScreen;
