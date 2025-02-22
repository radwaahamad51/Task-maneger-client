// components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ loginWithGoogle }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/'); // Redirect to the main app page after successful login
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Task Management App</h1>
      <p>Sign in with Google to get started</p>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin} className="google-login-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
