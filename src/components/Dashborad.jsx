import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  FileText,
  Home,
  Calendar,
  CreditCard,
  FileCheck,
  AlertCircle,
  LogOut,
  ChevronDown,
  Check,
  Printer,
  Clock,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

// Mock data for document types
const documentTypes = [
  {
    id: 1,
    name: 'إخراج قيد فردي',
    fees: 5000,
    timeToProcess: '1-2 أيام عمل',
    requiredDocs: ['هوية شخصية أو جواز سفر'],
  },
  {
    id: 2,
    name: 'إخراج قيد عائلي',
    fees: 8000,
    timeToProcess: '1-2 أيام عمل',
    requiredDocs: ['هوية شخصية أو جواز سفر'],
  },
  {
    id: 3,
    name: 'إفادة سكن',
    fees: 10000,
    timeToProcess: '1-3 أيام عمل',
    requiredDocs: ['هوية شخصية', 'سند ملكية أو عقد إيجار'],
  },
  {
    id: 4,
    name: 'رخصة بناء',
    fees: 150000,
    timeToProcess: '10-15 يوم عمل',
    requiredDocs: [
      'سند ملكية',
      'خريطة مساحة',
      'تصميم هندسي معتمد',
      'موافقة نقابة المهندسين',
    ],
  },
  {
    id: 5,
    name: 'شهادة حسن سلوك',
    fees: 15000,
    timeToProcess: '2-3 أيام عمل',
    requiredDocs: ['هوية شخصية', 'صورتان شمسيتان'],
  },
  {
    id: 6,
    name: 'تصديق مستندات',
    fees: 5000,
    timeToProcess: 'نفس اليوم',
    requiredDocs: ['المستندات الأصلية', 'هوية شخصية'],
  },
  {
    id: 7,
    name: 'إفادة عقارية',
    fees: 20000,
    timeToProcess: '3-5 أيام عمل',
    requiredDocs: ['هوية شخصية', 'رقم العقار'],
  },
  {
    id: 8,
    name: 'رخصة اشغال طريق',
    fees: 25000,
    timeToProcess: '3-5 أيام عمل',
    requiredDocs: ['طلب خطي', 'مخطط للموقع'],
  },
];

// Mock data for applications status
const mockApplications = [
  {
    id: 101,
    type: 'إخراج قيد فردي',
    requestDate: '2025-04-18',
    status: 'مكتمل',
    readyDate: '2025-04-19',
  },
  {
    id: 102,
    type: 'إفادة سكن',
    requestDate: '2025-04-20',
    status: 'قيد المعالجة',
    readyDate: null,
  },
  {
    id: 103,
    type: 'تصديق مستندات',
    requestDate: '2025-04-15',
    status: 'جاهز للاستلام',
    readyDate: '2025-04-16',
  },
];

// Mock tax data
const mockTaxes = [
  {
    id: 201,
    type: 'رسوم بلدية سنوية',
    amount: 150000,
    dueDate: '2025-06-30',
    status: 'غير مدفوع',
  },
  {
    id: 202,
    type: 'رسوم مياه',
    amount: 100000,
    dueDate: '2025-05-15',
    status: 'غير مدفوع',
  },
  {
    id: 203,
    type: 'رسوم كهرباء',
    amount: 220000,
    dueDate: '2025-04-10',
    status: 'متأخر',
  },
  {
    id: 204,
    type: 'رسوم تنظيف',
    amount: 50000,
    dueDate: '2025-03-15',
    status: 'مدفوع',
    paidDate: '2025-03-10',
  },
];

// Mock announcements
const mockAnnouncements = [
  {
    id: 301,
    title: 'قطع مياه مؤقت',
    date: '2025-04-25',
    content:
      'تعلن البلدية عن قطع المياه يوم الخميس القادم من الساعة 8 صباحاً حتى 4 عصراً للصيانة',
  },
  {
    id: 302,
    title: 'حملة تشجير',
    date: '2025-05-01',
    content:
      'حملة تشجير في برج الملوك يوم السبت القادم، نرجو من الجميع المشاركة',
  },
  {
    id: 303,
    title: 'مواعيد الدفع الضريبي',
    date: '2025-04-10',
    content: 'تذكير بمواعيد الدفع الضريبي السنوية قبل نهاية الشهر الحالي',
  },
];

const Dashboard = () => {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentForm, setDocumentForm] = useState({
    documentType: '',
    fullName: currentUser?.fullName || '',
    nationalId: '',
    phoneNumber: currentUser?.phone || '',
    address: '',
    notes: '',
    agreeToTerms: false,
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userApplications, setUserApplications] = useState(mockApplications);

  // Handle logout
  const handleLogout = () => {
    signout();
    navigate('/signin');
  };

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!documentForm.documentType)
      errors.documentType = 'الرجاء اختيار نوع المستند';
    if (!documentForm.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب';
    if (!documentForm.nationalId.trim()) errors.nationalId = 'رقم الهوية مطلوب';
    if (!documentForm.phoneNumber.trim())
      errors.phoneNumber = 'رقم الهاتف مطلوب';
    if (!/^[0-9]{8}$/.test(documentForm.phoneNumber.replace(/\s/g, '')))
      errors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح مكون من 8 أرقام';
    if (!documentForm.address.trim()) errors.address = 'العنوان مطلوب';
    if (!documentForm.agreeToTerms)
      errors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';

    // Check required attachments based on document type
    const selectedDocType = documentTypes.find(
      (doc) => doc.id === parseInt(documentForm.documentType)
    );
    if (
      selectedDocType &&
      documentForm.attachments.length < selectedDocType.requiredDocs.length
    ) {
      errors.attachments = 'الرجاء إرفاق جميع المستندات المطلوبة';
    }

    return errors;
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setDocumentForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setDocumentForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }));
    } else {
      setDocumentForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle document selection
  const handleDocumentSelect = (docId) => {
    setSelectedDocument(docId);
    setDocumentForm((prev) => ({ ...prev, documentType: docId }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      // Mock submission - in real app this would be an API call
      const newApplication = {
        id: Math.floor(1000 + Math.random() * 9000),
        type: documentTypes.find(
          (doc) => doc.id === parseInt(documentForm.documentType)
        ).name,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'قيد المعالجة',
        readyDate: null,
      };

      setUserApplications((prev) => [newApplication, ...prev]);
      setSubmitSuccess(true);

      // Reset form
      setTimeout(() => {
        setSubmitSuccess(false);
        setDocumentForm({
          documentType: '',
          fullName: currentUser?.fullName || '',
          nationalId: '',
          phoneNumber: currentUser?.phone || '',
          address: '',
          notes: '',
          agreeToTerms: false,
          attachments: [],
        });
        setSelectedDocument(null);
        setActiveTab('applications');
      }, 3000);
    } else {
      setFormErrors(errors);
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle payment for taxes
  const handlePayTax = (taxId) => {
    // Mock payment processing - in real app this would redirect to payment gateway
    alert('سيتم تحويلك إلى بوابة الدفع الإلكتروني');
  };

  return (
    <div className='min-h-screen bg-gray-100' dir='rtl'>
      {/* Header */}
      <header className='bg-gradient-to-r from-green-700 to-green-900 shadow-md'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img
                src='/borj_moulouk2.png'
                alt='شعار بلدية برج الملوك'
                className='h-12 w-12 rounded-full mr-3'
              />
              <div>
                <h1 className='text-2xl font-bold text-white'>
                  بلدية برج الملوك
                </h1>
                <p className='text-sm text-green-100'>
                  قضاء مرجعيون - محافظة النبطية
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-green-100 hidden md:block'>
                مرحباً، {currentUser.fullName}
              </span>
              <button
                onClick={handleLogout}
                className='flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                <LogOut className='ml-1 h-4 w-4' />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-col md:flex-row'>
        {/* Sidebar */}
        <aside className='bg-white shadow-md md:w-64 w-full md:min-h-screen'>
          <nav className='p-4'>
            <div className='mb-6 p-3 bg-green-50 rounded-lg'>
              <div className='flex items-center'>
                <User className='h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full' />
                <div className='mr-3'>
                  <p className='font-semibold text-gray-800'>
                    {currentUser.fullName}
                  </p>
                  <p className='text-xs text-gray-500'>{currentUser.email}</p>
                </div>
              </div>
            </div>

            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'dashboard'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className='ml-3 h-5 w-5' />
                  <span>الرئيسية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'documents'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className='ml-3 h-5 w-5' />
                  <span>طلب مستندات</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'applications'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileCheck className='ml-3 h-5 w-5' />
                  <span>طلباتي</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('taxes')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'taxes'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className='ml-3 h-5 w-5' />
                  <span>الرسوم والضرائب</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'announcements'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AlertCircle className='ml-3 h-5 w-5' />
                  <span>إعلانات البلدية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === 'profile'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className='ml-3 h-5 w-5' />
                  <span>الملف الشخصي</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 p-4 md:p-8'>
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                لوحة التحكم
              </h2>

              {/* Quick Access Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
                <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-semibold text-lg'>المستندات الجاهزة</h3>
                    <div className='bg-green-100 text-green-700 rounded-full h-10 w-10 flex items-center justify-center'>
                      <FileCheck className='h-5 w-5' />
                    </div>
                  </div>
                  <p className='text-3xl font-bold text-gray-800'>
                    {
                      userApplications.filter(
                        (app) => app.status === 'جاهز للاستلام'
                      ).length
                    }
                  </p>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className='mt-4 text-green-600 hover:text-green-800 text-sm flex items-center'
                  >
                    عرض التفاصيل
                  </button>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-semibold text-lg'>
                      الطلبات قيد المعالجة
                    </h3>
                    <div className='bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center'>
                      <Clock className='h-5 w-5' />
                    </div>
                  </div>
                  <p className='text-3xl font-bold text-gray-800'>
                    {
                      userApplications.filter(
                        (app) => app.status === 'قيد المعالجة'
                      ).length
                    }
                  </p>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className='mt-4 text-blue-600 hover:text-blue-800 text-sm flex items-center'
                  >
                    عرض التفاصيل
                  </button>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-semibold text-lg'>رسوم مستحقة</h3>
                    <div className='bg-red-100 text-red-700 rounded-full h-10 w-10 flex items-center justify-center'>
                      <CreditCard className='h-5 w-5' />
                    </div>
                  </div>
                  <p className='text-3xl font-bold text-gray-800'>
                    {mockTaxes.filter((tax) => tax.status !== 'مدفوع').length}
                  </p>
                  <button
                    onClick={() => setActiveTab('taxes')}
                    className='mt-4 text-red-600 hover:text-red-800 text-sm flex items-center'
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
                <h3 className='font-semibold text-xl mb-4'>آخر الإعلانات</h3>
                <div className='space-y-4'>
                  {mockAnnouncements.slice(0, 2).map((announcement) => (
                    <div
                      key={announcement.id}
                      className='border-r-4 border-green-500 bg-green-50 p-4 rounded-l-lg'
                    >
                      <div className='flex justify-between'>
                        <h4 className='font-semibold'>{announcement.title}</h4>
                        <span className='text-sm text-gray-500'>
                          {announcement.date}
                        </span>
                      </div>
                      <p className='text-gray-700 mt-2'>
                        {announcement.content}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className='text-green-600 hover:text-green-800 font-medium'
                  >
                    عرض جميع الإعلانات
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='font-semibold text-xl mb-4'>روابط سريعة</h3>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className='p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex flex-col items-center'
                  >
                    <FileText className='h-8 w-8 text-green-600 mb-2' />
                    <span className='text-sm text-center'>طلب مستند جديد</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('taxes')}
                    className='p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex flex-col items-center'
                  >
                    <CreditCard className='h-8 w-8 text-green-600 mb-2' />
                    <span className='text-sm text-center'>دفع الرسوم</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('applications')}
                    className='p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex flex-col items-center'
                  >
                    <FileCheck className='h-8 w-8 text-green-600 mb-2' />
                    <span className='text-sm text-center'>متابعة الطلبات</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className='p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex flex-col items-center'
                  >
                    <User className='h-8 w-8 text-green-600 mb-2' />
                    <span className='text-sm text-center'>تعديل البيانات</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Request View */}
          {activeTab === 'documents' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                طلب المستندات الرسمية
              </h2>

              {submitSuccess ? (
                <div
                  className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6'
                  role='alert'
                >
                  <div className='flex items-center'>
                    <Check className='h-5 w-5 mr-2' />
                    <strong className='font-bold'>تم تقديم الطلب بنجاح!</strong>
                  </div>
                  <span className='block sm:inline mt-1'>
                    سيتم معالجة طلبك في أقرب وقت ممكن.
                  </span>
                </div>
              ) : (
                <>
                  {/* Document Selection */}
                  {!selectedDocument ? (
                    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                      <h3 className='font-semibold text-xl mb-4'>
                        اختر نوع المستند المطلوب
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {documentTypes.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => handleDocumentSelect(doc.id)}
                            className='border rounded-lg p-4 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all'
                          >
                            <h4 className='font-semibold text-lg mb-2'>
                              {doc.name}
                            </h4>
                            <p className='text-sm text-gray-600 mb-1'>
                              <span className='font-medium'>الرسوم:</span>{' '}
                              {doc.fees} ل.ل
                            </p>
                            <p className='text-sm text-gray-600'>
                              <span className='font-medium'>مدة المعالجة:</span>{' '}
                              {doc.timeToProcess}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Selected Document Info */}
                      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                        <div className='flex justify-between items-center'>
                          <h3 className='font-semibold text-lg'>
                            {
                              documentTypes.find(
                                (d) => d.id === selectedDocument
                              )?.name
                            }
                          </h3>
                          <button
                            onClick={() => setSelectedDocument(null)}
                            className='text-gray-500 hover:text-gray-700'
                          >
                            تغيير المستند
                          </button>
                        </div>
                        <div className='mt-2 text-sm'>
                          <p>
                            <span className='font-medium'>الرسوم:</span>{' '}
                            {
                              documentTypes.find(
                                (d) => d.id === selectedDocument
                              )?.fees
                            }{' '}
                            ل.ل
                          </p>
                          <p>
                            <span className='font-medium'>
                              مدة المعالجة التقريبية:
                            </span>{' '}
                            {
                              documentTypes.find(
                                (d) => d.id === selectedDocument
                              )?.timeToProcess
                            }
                          </p>
                          <div className='mt-2'>
                            <p className='font-medium'>المستندات المطلوبة:</p>
                            <ul className='list-disc mr-5 mt-1'>
                              {documentTypes
                                .find((d) => d.id === selectedDocument)
                                ?.requiredDocs.map((doc, index) => (
                                  <li key={index}>{doc}</li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Application Form */}
                      <div className='bg-white rounded-lg shadow-md p-6'>
                        <h3 className='font-semibold text-xl mb-4'>
                          استمارة الطلب
                        </h3>
                        <form onSubmit={handleSubmit}>
                          <div className='mb-4'>
                            <label
                              className='block text-gray-700 mb-2'
                              htmlFor='fullName'
                            >
                              الاسم الكامل{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <input
                              type='text'
                              id='fullName'
                              name='fullName'
                              value={documentForm.fullName}
                              onChange={handleFormChange}
                              className={`w-full p-3 border rounded-lg ${
                                formErrors.fullName
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder='أدخل الاسم الكامل'
                            />
                            {formErrors.fullName && (
                              <p className='text-red-500 text-sm mt-1 error-message'>
                                {formErrors.fullName}
                              </p>
                            )}
                          </div>

                          <div className='mb-4'>
                            <label
                              className='block text-gray-700 mb-2'
                              htmlFor='nationalId'
                            >
                              رقم الهوية <span className='text-red-500'>*</span>
                            </label>
                            <input
                              type='text'
                              id='nationalId'
                              name='nationalId'
                              value={documentForm.nationalId}
                              onChange={handleFormChange}
                              className={`w-full p-3 border rounded-lg ${
                                formErrors.nationalId
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder='أدخل رقم الهوية'
                            />
                            {formErrors.nationalId && (
                              <p className='text-red-500 text-sm mt-1 error-message'>
                                {formErrors.nationalId}
                              </p>
                            )}
                          </div>

                          <div className='mb-4'>
                            <label
                              className='block text-gray-700 mb-2'
                              htmlFor='phoneNumber'
                            >
                              رقم الهاتف <span className='text-red-500'>*</span>
                            </label>
                            <input
                              type='tel'
                              id='phoneNumber'
                              name='phoneNumber'
                              value={documentForm.phoneNumber}
                              onChange={handleFormChange}
                              className={`w-full p-3 border rounded-lg ${
                                formErrors.phoneNumber
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder='أدخل رقم الهاتف'
                            />
                            {formErrors.phoneNumber && (
                              <p className='text-red-500 text-sm mt-1 error-message'>
                                {formErrors.phoneNumber}
                              </p>
                            )}
                          </div>

                          <div className='mb-4'>
                            <label
                              className='block text-gray-700 mb-2'
                              htmlFor='address'
                            >
                              العنوان الكامل{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <input
                              type='text'
                              id='address'
                              name='address'
                              value={documentForm.address}
                              onChange={handleFormChange}
                              className={`w-full p-3 border rounded-lg ${
                                formErrors.address
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder='أدخل العنوان الكامل'
                            />
                            {formErrors.address && (
                              <p className='text-red-500 text-sm mt-1 error-message'>
                                {formErrors.address}
                              </p>
                            )}
                          </div>

                          <div className='mb-4'>
                            <label
                              className='block text-gray-700 mb-2'
                              htmlFor='notes'
                            >
                              ملاحظات إضافية
                            </label>
                            <textarea
                              id='notes'
                              name='notes'
                              value={documentForm.notes}
                              onChange={handleFormChange}
                              className='w-full p-3 border border-gray-300 rounded-lg'
                              placeholder='أي معلومات إضافية تود إضافتها للطلب'
                              rows={3}
                            ></textarea>
                          </div>

                          <div className='mb-4'>
                            <label className='block text-gray-700 mb-2'>
                              المرفقات المطلوبة{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <div className='bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300'>
                              <p className='text-sm text-gray-600 mb-2'>
                                الرجاء إرفاق المستندات المطلوبة:
                              </p>
                              <ul className='list-disc mr-5 mb-3 text-sm'>
                                {documentTypes
                                  .find((d) => d.id === selectedDocument)
                                  ?.requiredDocs.map((doc, index) => (
                                    <li key={index}>{doc}</li>
                                  ))}
                              </ul>
                              <input
                                type='file'
                                id='attachments'
                                name='attachments'
                                onChange={handleFormChange}
                                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
                                multiple
                              />
                              {documentForm.attachments.length > 0 && (
                                <div className='mt-3'>
                                  <p className='font-medium text-sm'>
                                    الملفات المرفقة:
                                  </p>
                                  <ul className='text-sm text-gray-600'>
                                    {Array.from(documentForm.attachments).map(
                                      (file, idx) => (
                                        <li
                                          key={idx}
                                          className='flex items-center mt-1'
                                        >
                                          <Check className='h-4 w-4 text-green-500 ml-1' />
                                          {file.name}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              {formErrors.attachments && (
                                <p className='text-red-500 text-sm mt-1 error-message'>
                                  {formErrors.attachments}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className='mb-6'>
                            <label className='flex items-center'>
                              <input
                                type='checkbox'
                                name='agreeToTerms'
                                checked={documentForm.agreeToTerms}
                                onChange={handleFormChange}
                                className={`ml-2 h-5 w-5 text-green-600 ${
                                  formErrors.agreeToTerms
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              />
                              <span className='text-gray-700'>
                                أقر بأن جميع المعلومات المقدمة صحيحة وكاملة
                              </span>
                            </label>
                            {formErrors.agreeToTerms && (
                              <p className='text-red-500 text-sm mt-1 error-message'>
                                {formErrors.agreeToTerms}
                              </p>
                            )}
                          </div>

                          <div className='flex justify-end'>
                            <button
                              type='button'
                              onClick={() => setSelectedDocument(null)}
                              className='px-6 py-2 border border-gray-300 rounded-lg ml-3 hover:bg-gray-50'
                            >
                              إلغاء
                            </button>
                            <button
                              type='submit'
                              className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                            >
                              تقديم الطلب
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Applications View */}
          {activeTab === 'applications' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>طلباتي</h2>

              {userApplications.length > 0 ? (
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            رقم الطلب
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            نوع المستند
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            تاريخ الطلب
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            الحالة
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {userApplications.map((application) => (
                          <tr key={application.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              #{application.id}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {application.type}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {application.requestDate}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${
                                  application.status === 'مكتمل'
                                    ? 'bg-green-100 text-green-800'
                                    : application.status === 'قيد المعالجة'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {application.status}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {application.status === 'جاهز للاستلام' && (
                                <button className='text-green-600 hover:text-green-900 ml-3'>
                                  طباعة إيصال الاستلام
                                </button>
                              )}
                              {application.status === 'مكتمل' && (
                                <button className='flex items-center text-gray-600 hover:text-gray-900'>
                                  <Printer className='h-4 w-4 ml-1' />
                                  طباعة
                                </button>
                              )}
                              {application.status === 'قيد المعالجة' && (
                                <span className='text-gray-500'>
                                  يتم المراجعة
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-md p-10 text-center'>
                  <div className='flex justify-center'>
                    <FileText className='h-16 w-16 text-gray-300' />
                  </div>
                  <h3 className='mt-4 text-lg font-medium text-gray-900'>
                    لا توجد طلبات حالية
                  </h3>
                  <p className='mt-2 text-gray-500'>
                    لم تقم بإنشاء أي طلبات بعد.
                  </p>
                  <div className='mt-6'>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                    >
                      إنشاء طلب جديد
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Taxes View */}
          {activeTab === 'taxes' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                الرسوم والضرائب
              </h2>

              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          نوع الرسم
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          المبلغ (ل.ل)
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          تاريخ الاستحقاق
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          الحالة
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {mockTaxes.map((tax) => (
                        <tr key={tax.id}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {tax.type}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {tax.amount.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {tax.dueDate}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${
                                tax.status === 'مدفوع'
                                  ? 'bg-green-100 text-green-800'
                                  : tax.status === 'متأخر'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {tax.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm'>
                            {tax.status !== 'مدفوع' ? (
                              <button
                                onClick={() => handlePayTax(tax.id)}
                                className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200'
                              >
                                دفع الآن
                              </button>
                            ) : (
                              <button className='flex items-center text-gray-600 hover:text-gray-900 text-xs'>
                                <Printer className='h-4 w-4 ml-1' />
                                إيصال الدفع
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <h3 className='font-semibold text-blue-800 mb-2'>
                  معلومات الدفع
                </h3>
                <p className='text-sm text-blue-700'>
                  يمكنك دفع الرسوم والضرائب البلدية بإحدى الطرق التالية:
                </p>
                <ul className='list-disc mr-5 mt-2 text-sm text-blue-700'>
                  <li>عبر البوابة الإلكترونية باستخدام بطاقة الائتمان</li>
                  <li>من خلال زيارة مقر البلدية مباشرة</li>
                  <li>عبر التحويل المصرفي إلى حساب البلدية</li>
                  <li>عبر تطبيقات الدفع الإلكتروني المعتمدة</li>
                </ul>
              </div>
            </div>
          )}

          {/* Announcements View */}
          {activeTab === 'announcements' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                إعلانات البلدية
              </h2>

              <div className='space-y-6'>
                {mockAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className='bg-white rounded-lg shadow-md p-6'
                  >
                    <div className='flex justify-between'>
                      <h3 className='font-semibold text-lg text-gray-800'>
                        {announcement.title}
                      </h3>
                      <span className='text-sm text-gray-500'>
                        {announcement.date}
                      </span>
                    </div>
                    <div className='mt-3 text-gray-600'>
                      <p>{announcement.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                <h3 className='font-semibold text-yellow-800 mb-2'>ملاحظة</h3>
                <p className='text-sm text-yellow-700'>
                  يتم تحديث الإعلانات بشكل دوري، يرجى مراجعة الصفحة بانتظام
                  للاطلاع على آخر المستجدات والقرارات البلدية.
                </p>
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                الملف الشخصي
              </h2>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex flex-col md:flex-row'>
                  <div className='flex-shrink-0 flex flex-col items-center mb-6 md:mb-0 md:ml-8'>
                    <div className='bg-green-100 p-6 rounded-full'>
                      <User className='h-16 w-16 text-green-600' />
                    </div>
                    <button className='mt-4 text-sm text-blue-600 hover:text-blue-800'>
                      تغيير الصورة
                    </button>
                  </div>

                  <div className='flex-1'>
                    <h3 className='font-semibold text-xl mb-4'>
                      المعلومات الشخصية
                    </h3>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          الاسم الكامل
                        </label>
                        <input
                          type='text'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          defaultValue={currentUser.fullName}
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          البريد الإلكتروني
                        </label>
                        <input
                          type='email'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          defaultValue={currentUser.email}
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          رقم الهاتف
                        </label>
                        <input
                          type='tel'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          defaultValue={currentUser.phone}
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          العنوان
                        </label>
                        <input
                          type='text'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          placeholder='أدخل عنوانك الكامل'
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          رقم الهوية
                        </label>
                        <input
                          type='text'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          placeholder='أدخل رقم الهوية'
                        />
                      </div>
                    </div>

                    <h3 className='font-semibold text-xl mb-4 mt-8'>
                      تغيير كلمة المرور
                    </h3>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          كلمة المرور الحالية
                        </label>
                        <input
                          type='password'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          placeholder='كلمة المرور الحالية'
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          كلمة المرور الجديدة
                        </label>
                        <input
                          type='password'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          placeholder='كلمة المرور الجديدة'
                        />
                      </div>

                      <div>
                        <label className='block text-gray-700 text-sm font-medium mb-1'>
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type='password'
                          className='w-full p-3 border border-gray-300 rounded-lg'
                          placeholder='تأكيد كلمة المرور الجديدة'
                        />
                      </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                      <button className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'>
                        حفظ التغييرات
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
                <h3 className='font-semibold text-xl mb-4'>
                  إعدادات الإشعارات
                </h3>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 border-b'>
                    <div>
                      <p className='font-medium'>إشعارات البريد الإلكتروني</p>
                      <p className='text-sm text-gray-500'>
                        استلام تنبيهات على البريد الإلكتروني
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked
                      />
                      <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600'></div>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-3 border-b'>
                    <div>
                      <p className='font-medium'>إشعارات الرسائل النصية</p>
                      <p className='text-sm text-gray-500'>
                        استلام تنبيهات على الهاتف المحمول
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input type='checkbox' className='sr-only peer' />
                      <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600'></div>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-3'>
                    <div>
                      <p className='font-medium'>تنبيهات الإعلانات البلدية</p>
                      <p className='text-sm text-gray-500'>
                        الحصول على إشعارات بشأن إعلانات البلدية الجديدة
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked
                      />
                      <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600'></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className='bg-gray-800 py-6 text-center text-sm text-gray-400 mt-8'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              &copy; {new Date().getFullYear()} بلدية برج الملوك - قضاء مرجعيون
              - محافظة النبطية. جميع الحقوق محفوظة.
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse'>
              <a href='#' className='hover:text-white'>
                سياسة الخصوصية
              </a>
              <a href='#' className='hover:text-white'>
                شروط الاستخدام
              </a>
              <a href='#' className='hover:text-white'>
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
