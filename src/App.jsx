import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // 👈 thêm useNavigate
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import RootLayout from './layouts/RootLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TaskManager from './pages/TaskManager.jsx';
import BugManager from './pages/BugManager.jsx';
import LearnManager from './pages/LearnManager.jsx';
import Settings from './pages/Settings.jsx';

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', gap:12, color:'var(--text2)', fontFamily:'var(--mono)' }}>
      <div style={{ width:18, height:18, border:'2px solid var(--border2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      Đang tải...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/bugs" element={<BugManager />} />
        <Route path="/learn" element={<LearnManager />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootLayout>
  );
}

function LoginPage() {
  const navigate = useNavigate(); // 👈 hook điều hướng
  const { signIn, signUp, loading, authError, clearError } = useAuth();
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');
    if (clearError) clearError();

    console.log('=== Auth Submit ===');
    console.log('Mode:', mode);
    console.log('Email:', email);

    try {
      if (mode === 'login') {
        console.log('Calling signIn...');
        await signIn(email, password);
        console.log('Sign in successful');
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        navigate('/'); // 👈 CHUYỂN HƯỚNG SANG TRANG CHỦ
      } else {
        console.log('Calling signUp...');
        await signUp(email, password);
        console.log('Sign up successful');
        setSuccessMsg('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
        }, 2000);
      }
    } catch (er) {
      console.error('Auth error:', er);
      let errorMsg = er.message;
      if (errorMsg.includes('Invalid login credentials')) {
        errorMsg = 'Sai email hoặc mật khẩu';
      } else if (errorMsg.includes('Email not confirmed')) {
        errorMsg = 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.';
      } else if (errorMsg.includes('User already registered')) {
        errorMsg = 'Email đã được đăng ký';
      } else if (errorMsg.includes('Password should be at least 6 characters')) {
        errorMsg = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      setErr(`❌ ${errorMsg}`);
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--accent)', letterSpacing:3, marginBottom:8, textTransform:'uppercase' }}>QLCV — v1.0</div>
          <h1 style={{ fontSize:28, fontWeight:800, lineHeight:1.1 }}>Quản lý<br/>công việc</h1>
        </div>

        {successMsg && (
          <div style={{
            padding:'12px 16px',
            borderRadius:'var(--radius-sm)',
            marginBottom:20,
            background:'rgba(34,197,94,0.1)',
            border:'1px solid #22c55e',
            color:'#22c55e',
            fontSize:14
          }}>
            {successMsg}
          </div>
        )}

        {(err || authError) && (
          <div style={{
            padding:'12px 16px',
            borderRadius:'var(--radius-sm)',
            marginBottom:20,
            background:'rgba(239,68,68,0.1)',
            border:'1px solid var(--accent2)',
            color:'var(--accent2)',
            fontSize:14
          }}>
            {err || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <input
            type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Email" required
            style={inputStyle}
          />
          <input
            type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Mật khẩu" required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div style={{ marginTop:16, textAlign:'center', color:'var(--text2)', fontSize:13 }}>
          {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErr('');
              setSuccessMsg('');
              if (clearError) clearError();
            }}
            style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)', fontSize:13 }}
          >
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
  color:'var(--text)', padding:'10px 14px', fontSize:14, outline:'none',
  fontFamily:'var(--font)', transition:'border-color var(--transition)',
};
const btnStyle = {
  background:'var(--accent)', border:'none', borderRadius:'var(--radius-sm)',
  color:'#fff', padding:'11px 16px', fontSize:14, fontWeight:600,
  fontFamily:'var(--font)', transition:'opacity var(--transition)',
  cursor: 'pointer',
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', fontFamily:'var(--font)', fontSize:14 }
      }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </AuthProvider>
  );
}