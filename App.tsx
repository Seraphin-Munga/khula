import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadStateFromStorage, saveStateToStorage } from './src/utils/storage';

export default function App() {
  useEffect(() => {
    // Load persisted state on app start
    const loadPersistedState = async () => {
      const persistedState = await loadStateFromStorage();
      if (persistedState) {
        // You could dispatch an action to restore the state here
        console.log('Loaded persisted state:', persistedState);
      }
    };

    loadPersistedState();
  }, []);

  // Subscribe to store changes to save state
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      saveStateToStorage(state);
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppNavigator />
    </Provider>
  );
}
