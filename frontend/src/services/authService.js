import { apiClient } from './apiClient'

export const authService = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  register(payload) {
    return apiClient.post('/auth/register', payload)
  },

  verifyRegisterOtp(payload) {
    return apiClient.post('/auth/verify-register-otp', payload)
  },

  verifyLoginOtp(payload) {
    return apiClient.post('/auth/verify-login-otp', payload)
  },

  getProfile() {
    return apiClient.get('/auth/profile')
  },
}
