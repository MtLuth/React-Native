import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {showErrorMessage, showSuccessMessage} from '../utils/ToastMessage';

axios.defaults.baseURL = 'http://192.168.1.138:8080/api/v1';

const EditProfileScreen = ({navigation, route}) => {
  const {user} = route.params || {};
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    try {
      await axios.post('/auth/send-otp', {id: user._id, email: email});

      showSuccessMessage('OTP đã được gửi đến email của bạn');
      setIsOtpSent(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response?.data.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isOtpSent) {
        await axios.post('/auth/verify/otp', {id: user._id, otp});
      }
      const response = await axios.put(`/user/${user._id}`, {
        email,
        fullName,
        phoneNumber,
      });

      showSuccessMessage(response.data?.message);
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response?.data.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Họ và Tên:</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Số điện thoại:</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {isOtpSent && (
        <>
          <Text style={styles.label}>Nhập OTP:</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
        </>
      )}

      {(email !== user.email ||
        (phoneNumber !== user?.phoneNumber && phoneNumber)) &&
      !isOtpSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Gửi mã OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleCancel}>
        <Text style={styles.buttonText}>Hủy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  label: {fontSize: 16, fontWeight: 'bold', marginTop: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16},
});

export default EditProfileScreen;
