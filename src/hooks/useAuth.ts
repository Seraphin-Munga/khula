import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  loginUser,
  registerUser,
  logoutUser,
  loadUserProfile,
  updateUserProfile,
  clearError,
} from '../store/slices/userProfileSlice';
import { LoginRequest, RegisterRequest } from '../models/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.userProfile);

  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials));
    return {
      success: loginUser.fulfilled.match(result),
      error: loginUser.rejected.match(result) ? result.payload as string : null,
    };
  };

  const register = async (userData: RegisterRequest) => {
    const result = await dispatch(registerUser(userData));
    return {
      success: registerUser.fulfilled.match(result),
      error: registerUser.rejected.match(result) ? result.payload as string : null,
    };
  };

  const logout = async () => {
    const result = await dispatch(logoutUser());
    return {
      success: logoutUser.fulfilled.match(result),
      error: logoutUser.rejected.match(result) ? result.payload as string : null,
    };
  };

  const loadProfile = async () => {
    const result = await dispatch(loadUserProfile());
    return {
      success: loadUserProfile.fulfilled.match(result),
      error: loadUserProfile.rejected.match(result) ? result.payload as string : null,
    };
  };

  const updateProfile = async (updates: Partial<NonNullable<typeof auth.user>>) => {
    const result = await dispatch(updateUserProfile(updates));
    return {
      success: updateUserProfile.fulfilled.match(result),
      error: updateUserProfile.rejected.match(result) ? result.payload as string : null,
    };
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    user: auth.user,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading,
    error: auth.error,
    token: auth.token,

    // Actions
    login,
    register,
    logout,
    loadProfile,
    updateProfile,
    clearAuthError,
  };
}; 