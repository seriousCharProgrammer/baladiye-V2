import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state with validation errors
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Separate errors state object
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate full name
  const validateFullName = (name) => {
    if (!name.trim()) return 'الاسم الكامل مطلوب';
    if (name.trim().length < 3) return 'يجب أن يكون الاسم 3 أحرف على الأقل';
    if (!/^[\u0600-\u06FF\s\w]+$/.test(name)) return 'يرجى إدخال اسم صحيح';
    return '';
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email.trim()) return 'البريد الإلكتروني مطلوب';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'يرجى إدخال بريد إلكتروني صحيح';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'رقم الهاتف مطلوب';

    // Lebanese mobile patterns: 03, 70, 71, 76, 78, 79, 81 + 6 digits
    // Lebanese landline patterns: 01, 04, 05, 06, 07, 08, 09 + 6 digits
    // Can have optional +961 or 961 prefix
    const phoneRegex =
      /^(?:(?:\+?961)|0)?(?:(?:3|70|71|76|78|79|81)\d{6}|(?:1|4|5|6|7|8|9)\d{7})$/;

    if (!phoneRegex.test(phone)) return 'يرجى إدخال رقم هاتف لبناني صحيح';
    return '';
  };
  // Validate password
  const validatePassword = (password) => {
    if (!password) return 'كلمة المرور مطلوبة';
    if (password.length < 8)
      return 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل';
    if (!/[A-Z]/.test(password))
      return 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل';
    if (!/[a-z]/.test(password))
      return 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل';
    if (!/[0-9]/.test(password))
      return 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل';
    return '';
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'تأكيد كلمة المرور مطلوب';
    if (confirmPassword !== password) return 'كلمات المرور غير متطابقة';
    return '';
  };

  // Field change handler with validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Reset general error when user makes changes
    setError('');

    // Validate on change
    let errorMessage = '';
    switch (name) {
      case 'fullName':
        errorMessage = validateFullName(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        // Also update confirmPassword error if it exists
        if (formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(
              formData.confirmPassword,
              value
            ),
          }));
        }
        break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ),
    };

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();
    if (!isValid) return;

    // Start loading
    setLoading(true);
    setError('');

    try {
      // Use the signup method from AuthContext
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Show success message
      setSuccess(true);

      // Wait before redirecting
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      // Show error message
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, text: '', color: 'bg-gray-200' };

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    let text = '';
    let color = '';

    switch (strength) {
      case 0:
      case 1:
        text = 'ضعيفة';
        color = 'bg-red-500';
        break;
      case 2:
      case 3:
        text = 'متوسطة';
        color = 'bg-yellow-500';
        break;
      case 4:
      case 5:
        text = 'قوية';
        color = 'bg-green-500';
        break;
      default:
        break;
    }

    return { strength: (strength / 5) * 100, text, color };
  };

  const passwordStrength = getPasswordStrength();

  if (success) {
    return (
      <div
        className='flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-4'
        dir='rtl'
      >
        <div className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle className='h-12 w-12 text-green-500' />
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            تم إنشاء الحساب بنجاح!
          </h2>
          <p className='mb-6 text-gray-600'>
            جاري تحويلك إلى صفحة تسجيل الدخول...
          </p>
          <Link
            to='/signin'
            className='inline-block rounded-lg bg-green-700 px-6 py-3 text-center font-medium text-white transition-all hover:bg-green-800'
          >
            الذهاب إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

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
            إنشاء حساب جديد في البوابة الإلكترونية
          </p>
        </div>

        {/* نموذج إنشاء الحساب */}
        <div className='p-8'>
          {error && (
            <div className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* الاسم الكامل */}
            <div className='mb-4'>
              <label
                htmlFor='fullName'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                الاسم الكامل
              </label>
              <div className='relative'>
                <input
                  id='fullName'
                  name='fullName'
                  type='text'
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                  placeholder='أدخل اسمك الكامل'
                  required
                />
                <User className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              </div>
              {errors.fullName && (
                <p className='mt-1 text-xs text-red-500'>{errors.fullName}</p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                البريد الإلكتروني
              </label>
              <div className='relative'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                  placeholder='أدخل بريدك الإلكتروني'
                  required
                />
                <Mail className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              </div>
              {errors.email && (
                <p className='mt-1 text-xs text-red-500'>{errors.email}</p>
              )}
            </div>

            {/* رقم الهاتف */}
            <div className='mb-4'>
              <label
                htmlFor='phone'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                رقم الهاتف
              </label>
              <div className='relative'>
                <input
                  id='phone'
                  name='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                  placeholder='أدخل رقم هاتفك'
                  required
                />
                <Phone className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              </div>
              {errors.phone && (
                <p className='mt-1 text-xs text-red-500'>{errors.phone}</p>
              )}
              <p className='mt-1 text-xs text-gray-500'>
                مثال: 03123456 أو 71123456 (رقم لبناني)
              </p>
            </div>

            {/* كلمة المرور */}
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                كلمة المرور
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                  placeholder='أدخل كلمة المرور'
                  required
                  minLength={8}
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
              {errors.password && (
                <p className='mt-1 text-xs text-red-500'>{errors.password}</p>
              )}

              {/* مقياس قوة كلمة المرور */}
              {formData.password && (
                <>
                  <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200'>
                    <div
                      className={`h-full ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <p className='mt-1 text-xs text-gray-600'>
                    قوة كلمة المرور:{' '}
                    <span className='font-medium'>{passwordStrength.text}</span>
                  </p>
                </>
              )}

              <p className='mt-1 text-xs text-gray-500'>
                يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف
                صغير، ورقم واحد
              </p>
            </div>

            {/* تأكيد كلمة المرور */}
            <div className='mb-6'>
              <label
                htmlFor='confirmPassword'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                تأكيد كلمة المرور
              </label>
              <div className='relative'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                  placeholder='أعد إدخال كلمة المرور'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* الموافقة على الشروط */}
            <div className='mb-6 flex items-center'>
              <input
                id='agreeTerms'
                name='agreeTerms'
                type='checkbox'
                checked={formData.agreeTerms}
                onChange={handleChange}
                className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
                required
              />
              <label
                htmlFor='agreeTerms'
                className='mr-2 text-sm text-gray-600'
              >
                أوافق على{' '}
                <button
                  type='button'
                  className='font-medium text-green-700 hover:text-green-800'
                  onClick={() => console.log('عرض الشروط والأحكام')}
                >
                  الشروط والأحكام
                </button>{' '}
                و{' '}
                <button
                  type='button'
                  className='font-medium text-green-700 hover:text-green-800'
                  onClick={() => console.log('عرض سياسة الخصوصية')}
                >
                  سياسة الخصوصية
                </button>
              </label>
            </div>

            {/* زر إنشاء الحساب */}
            <button
              type='submit'
              className='mb-4 w-full rounded-lg bg-gradient-to-r from-green-700 to-green-800 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-70'
              disabled={
                !formData.agreeTerms ||
                Object.values(errors).some((error) => error) ||
                loading
              }
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
                  جاري التسجيل...
                </div>
              ) : (
                'إنشاء حساب'
              )}
            </button>

            {/* رابط تسجيل الدخول */}
            <div className='text-center text-sm text-gray-600'>
              لديك حساب بالفعل؟{' '}
              <Link
                to='/signin'
                className='font-medium text-green-700 hover:text-green-800'
              >
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
