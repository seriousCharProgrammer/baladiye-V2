import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const SignIn = () => {
  const { signin, isAuthenticated, defaultUser } = useAuth();

  // Pre-populate the email field with the default user email
  const [email, setEmail] = useState(defaultUser.email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/electionsDashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signin(email, password);
      // Navigation will happen in useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-4'
      dir='rtl'
    >
      <div className='w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl'>
        {/* رأس الصفحة */}
        <div className='bg-gradient-to-r from-green-700 to-green-900 px-8 py-10 text-center text-white'>
          <h1 className='mb-2 text-3xl font-bold'>بلدية برج الملوك</h1>
          <p className='mb-1 text-lg font-medium text-green-100'>
            قضاء مرجعيون - محافظة النبطية
          </p>
          <p className='text-green-200'>
            أهلاً بك في البوابة الإلكترونية للبلدية
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <div className='p-8'>
          {error && (
            <div className='mb-4 flex items-center rounded-lg bg-red-50 p-4 text-sm text-red-700'>
              <AlertCircle className='mr-2 h-5 w-5 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* حقل البريد الإلكتروني */}
            <div className='mb-6'>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                البريد الإلكتروني
              </label>
              <div className='relative'>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-right focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                  placeholder='أدخل بريدك الإلكتروني'
                  required
                />
                <Mail className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className='mb-6'>
              <label
                htmlFor='password'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                كلمة المرور
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-right focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                  placeholder='أدخل كلمة المرور'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type='submit'
              className='w-full rounded-lg bg-gradient-to-r from-green-700 to-green-800 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-70'
              disabled={loading}
            >
              {loading ? (
                <div className='inline-flex items-center'>
                  <svg
                    className='mr-2 h-4 w-4 animate-spin text-white'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
