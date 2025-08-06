import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store/store';

const STORAGE_KEY = 'khula_app_state';

export const saveStateToStorage = async (state: RootState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to storage:', error);
  }
};

export const loadStateFromStorage = async (): Promise<Partial<RootState> | null> => {
  try {
    const stateString = await AsyncStorage.getItem(STORAGE_KEY);
    if (stateString) {
      return JSON.parse(stateString);
    }
  } catch (error) {
    console.error('Error loading state from storage:', error);
  }
  return null;
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}; 