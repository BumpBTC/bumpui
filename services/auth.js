import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
};