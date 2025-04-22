import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

// Create the constant user object with the specified details
const defaultUser = {
  email: 'charbelalhajj@gmail.com',
  password: 'Charbel$$$',
  name: 'Charbel Alhajj',
  phonenumber: '+96171328893',
};

const SignIn = () => {
  // Pre-populate the email field with the default user email
  const [email, setEmail] = useState(defaultUser.email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signin, isAuthenticated, signup, users } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Make sure default user exists in the system on component mount
  useEffect(() => {
    const ensureDefaultUserExists = () => {
      const defaultUserExists = users.some(
        (user) => user.email === defaultUser.email
      );
      if (!defaultUserExists) {
        try {
          signup(defaultUser);
          console.log('Default user created successfully');
        } catch (error) {
          console.error('Failed to create default user:', error.message);
        }
      }
    };

    ensureDefaultUserExists();
  }, [signup, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Direct comparison for default user
      if (email === defaultUser.email && password === defaultUser.password) {
        console.log('Using default user login');
        await signin(defaultUser.email, defaultUser.password);
      } else {
        // Normal auth flow
        await signin(email, password);
      }
      // Navigation will happen in useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك');
    } finally {
      setLoading(false);
    }
  };

  // Function to fill in default user credentials
  const fillDefaultCredentials = () => {
    setEmail(defaultUser.email);
    setPassword(defaultUser.password);
  };

  // Direct login with default user
  const loginWithDefaultUser = async () => {
    setEmail(defaultUser.email);
    setPassword(defaultUser.password);
    setLoading(true);
    setError('');

    try {
      await signin(defaultUser.email, defaultUser.password);
      // Navigation will happen in useEffect
    } catch (error) {
      console.error('Default login error:', error);
      setError('فشل تسجيل الدخول بالحساب الافتراضي');
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
              <div className='mb-2 flex items-center justify-between'>
                <button
                  type='button'
                  className='text-xs font-medium text-green-700 hover:text-green-800'
                  onClick={() => console.log('نسيت كلمة المرور')}
                >
                  نسيت كلمة المرور؟
                </button>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  كلمة المرور
                </label>
              </div>
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

            {/* تذكرني */}
            <div className='mb-6 flex items-center'>
              <label
                htmlFor='remember-me'
                className='mr-2 text-sm text-gray-600'
              >
                تذكرني
              </label>
              <input
                id='remember-me'
                type='checkbox'
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
              />
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type='submit'
              className='mb-4 w-full rounded-lg bg-gradient-to-r from-green-700 to-green-800 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-70'
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

            {/* Quick login with default user credentials */}
            <button
              type='button'
              onClick={loginWithDefaultUser}
              className='mb-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-center text-sm font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
              disabled={loading}
            >
              تسجيل الدخول بالحساب الافتراضي
            </button>

            {/* Fill credentials button */}
            <button
              type='button'
              onClick={fillDefaultCredentials}
              className='mb-4 w-full rounded-lg border border-blue-500 bg-white py-2 text-center text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300'
            >
              ملء بيانات المستخدم الافتراضي
            </button>

            {/* رابط إنشاء حساب */}
            <div className='text-center text-sm text-gray-600'>
              ليس لديك حساب؟{' '}
              <Link
                to='/signup'
                className='font-medium text-green-700 hover:text-green-800'
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </form>

          <div className='mt-8'>
            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
