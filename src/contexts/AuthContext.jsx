// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Lỗi getSession:', error);
        setAuthError(error.message);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth State Change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('✅ Đăng nhập thành công!');
        setUser(session?.user ?? null);
        setAuthError(null);
      } else if (event === 'SIGNED_OUT') {
        console.log('📤 Đã đăng xuất');
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        console.log('📝 User updated');
        setUser(session?.user ?? null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    console.log('🔑 Bắt đầu đăng nhập:', email);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('❌ Lỗi đăng nhập:', error);
        console.error('Error code:', error.status);
        console.error('Error message:', error.message);
        setAuthError(error.message);
        throw error;
      }
      
      console.log('✅ Đăng nhập thành công! User:', data.user?.email);
      console.log('Session:', data.session);
      setAuthError(null);
      return data;
    } catch (err) {
      console.error('❌ Catch error:', err);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    console.log('📝 Bắt đầu đăng ký:', email);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('❌ Lỗi đăng ký:', error);
        console.error('Error code:', error.status);
        console.error('Error message:', error.message);
        setAuthError(error.message);
        throw error;
      }
      
      console.log('✅ Đăng ký thành công!');
      console.log('User:', data.user);
      console.log('Session:', data.session);
      
      if (data.user && !data.session) {
        console.log('⚠️ User đã tạo nhưng chưa được xác nhận email');
        setAuthError('Vui lòng kiểm tra email để xác nhận tài khoản');
      }
      
      setAuthError(null);
      return data;
    } catch (err) {
      console.error('❌ Catch error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    console.log('📤 Đang đăng xuất...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Lỗi đăng xuất:', error);
      throw error;
    }
    console.log('✅ Đã đăng xuất');
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      authError,
      signIn, 
      signUp, 
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};