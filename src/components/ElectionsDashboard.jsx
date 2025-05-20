import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  X,
  PieChart,
  BarChart,
  LogOut,
  Database,
} from 'lucide-react';
import {
  PieChart as RechartsPlePieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import votersData from './voters';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ElectionsDashboard = () => {
  const { signout } = useAuth();
  // State for electors data
  const [electors, setElectors] = useState([]);
  // State for filtered electors
  const [filteredElectors, setFilteredElectors] = useState([]);
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for filter status
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'voted', 'notVoted', 'votedForUs', 'votedForThem'
  // State for election results
  const [results, setResults] = useState({
    ourTeam: 0,
    otherTeam: 0,
    notVoted: 0,
    total: 0,
  });
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // State for the elector being confirmed
  const [confirmElector, setConfirmElector] = useState(null);
  // State for the new status being confirmed
  const [confirmStatus, setConfirmStatus] = useState('');
  // State for selected chart type
  const [chartType, setChartType] = useState('pie');
  // State for error message
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Handle logout
  const handleLogout = () => {
    signout();
    navigate('/signin');
  };

  // Load data from localStorage or initialize from source
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);

        // Try to get saved data from localStorage
        const savedData = localStorage.getItem('electorsData');

        if (savedData) {
          // If we have saved data, use it
          const parsedData = JSON.parse(savedData);
          setElectors(parsedData);
          setFilteredElectors(parsedData);
          updateResults(parsedData);
        } else {
          // Otherwise, initialize from the imported source
          // Transform the raw data
          const transformedData = votersData
            .filter((item) => item !== null) // Filter out null entries
            .map((voter, index) => {
              return {
                id: index + 1,
                name: voter.name || '',
                fatherName: voter.fathername || '',
                motherName: voter.mothername || '',
                dateOfBirth: voter.birthdate || '',
                religion: voter.relegion || '',
                familyNumber: voter['family code'] || '',
                notes: voter.notes || '',
                voteStatus: 'notVoted', // Default status
                phone: '',
                address: `عائلة ${voter.fathername || ''}`, // Using father name for address
              };
            });

          setElectors(transformedData);
          setFilteredElectors(transformedData);
          updateResults(transformedData);

          // Save initial data to localStorage
          localStorage.setItem('electorsData', JSON.stringify(transformedData));
        }

        // Also save the results to localStorage
        const savedResults = localStorage.getItem('electionResults');
        if (savedResults) {
          setResults(JSON.parse(savedResults));
        }

        setLoading(false);
      } catch (e) {
        console.error('General error loading data:', e);
        setError('فشل تحميل البيانات - استخدام بيانات تجريبية');
        generateAndUseMockData();
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to generate mock data if needed
  const generateAndUseMockData = () => {
    const mockData = generateMockData(50);
    setElectors(mockData);
    setFilteredElectors(mockData);
    updateResults(mockData);
    // Save mock data to localStorage
    localStorage.setItem('electorsData', JSON.stringify(mockData));
  };

  // Helper function to generate mock data
  const generateMockData = (count) => {
    const firstNames = [
      'محمد',
      'أحمد',
      'علي',
      'حسن',
      'حسين',
      'فاطمة',
      'زينب',
      'مريم',
      'خديجة',
      'عائشة',
    ];
    const lastNames = [
      'الخوري',
      'الحاج',
      'السيد',
      'حرب',
      'عباس',
      'شمس',
      'خليل',
      'ناصر',
      'حمدان',
      'صالح',
    ];
    const religions = ['مسلم', 'مسيحي', 'درزي'];
    const voteStatuses = ['notVoted', 'ourTeam', 'otherTeam'];

    return Array.from({ length: count }, (_, i) => {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fatherName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const motherName =
        firstNames[Math.floor(Math.random() * firstNames.length)] +
        ' ' +
        lastNames[Math.floor(Math.random() * lastNames.length)];
      const voteStatus =
        voteStatuses[Math.floor(Math.random() * voteStatuses.length)];

      return {
        id: i + 1,
        name: `${firstName} ${lastName}`,
        fatherName,
        motherName,
        dateOfBirth: `${Math.floor(
          Math.random() * (2000 - 1950) + 1950
        )}-${String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          '0'
        )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        religion: religions[Math.floor(Math.random() * religions.length)],
        familyNumber: Math.floor(Math.random() * 100) + 1,
        notes: Math.random() > 0.7 ? 'ملاحظة للمتابعة' : '',
        voteStatus,
        phone: `+961 ${Math.floor(Math.random() * 10000000) + 70000000}`,
        address: `عائلة ${lastName}`,
      };
    });
  };

  // Update results helper function
  const updateResults = (electorsData) => {
    const ourTeamCount = electorsData.filter(
      (elector) => elector.voteStatus === 'ourTeam'
    ).length;
    const otherTeamCount = electorsData.filter(
      (elector) => elector.voteStatus === 'otherTeam'
    ).length;
    const notVotedCount = electorsData.filter(
      (elector) => elector.voteStatus === 'notVoted'
    ).length;

    const newResults = {
      ourTeam: ourTeamCount,
      otherTeam: otherTeamCount,
      notVoted: notVotedCount,
      total: electorsData.length,
    };

    setResults(newResults);

    // Save results to localStorage
    localStorage.setItem('electionResults', JSON.stringify(newResults));
  };

  // Handle search
  useEffect(() => {
    handleSearch();
  }, [searchQuery, filterStatus, electors]);

  const handleSearch = () => {
    let filtered = [...electors];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (elector) =>
          elector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          elector.fatherName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          elector.motherName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          elector.dateOfBirth.includes(searchQuery) ||
          elector.religion.toLowerCase().includes(searchQuery.toLowerCase()) ||
          elector.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (elector.familyNumber &&
            elector.familyNumber.toString().includes(searchQuery))
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((elector) => {
        if (filterStatus === 'voted') {
          return (
            elector.voteStatus === 'ourTeam' ||
            elector.voteStatus === 'otherTeam'
          );
        } else if (filterStatus === 'notVoted') {
          return elector.voteStatus === 'notVoted';
        } else if (filterStatus === 'votedForUs') {
          return elector.voteStatus === 'ourTeam';
        } else if (filterStatus === 'votedForThem') {
          return elector.voteStatus === 'otherTeam';
        }
        return true;
      });
    }

    setFilteredElectors(filtered);
  };

  // Open confirmation modal
  const openConfirmationModal = (electorId, newStatus) => {
    const elector = electors.find((e) => e.id === electorId);
    setConfirmElector(elector);
    setConfirmStatus(newStatus);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmModal(false);
    setConfirmElector(null);
    setConfirmStatus('');
  };

  // Handle vote status change (after confirmation)
  const handleVoteStatusChange = () => {
    if (!confirmElector || !confirmStatus) return;

    const updatedElectors = electors.map((elector) => {
      if (elector.id === confirmElector.id) {
        return { ...elector, voteStatus: confirmStatus };
      }
      return elector;
    });

    setElectors(updatedElectors);
    updateResults(updatedElectors);

    // Save updated data to localStorage
    localStorage.setItem('electorsData', JSON.stringify(updatedElectors));

    closeConfirmationModal();
  };

  // Get vote status badge
  const getVoteStatusBadge = (status) => {
    switch (status) {
      case 'ourTeam':
        return (
          <span className='bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium'>
            صوت لنا
          </span>
        );
      case 'otherTeam':
        return (
          <span className='bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium'>
            صوت للآخرين
          </span>
        );
      case 'notVoted':
        return (
          <span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium'>
            لم يصوت
          </span>
        );
      default:
        return null;
    }
  };
  // Handle navigation to CategorizedDataViewer
  const navigateToDataViewer = () => {
    navigate('/data-viewer');
  };

  // Get vote status text
  const getVoteStatusText = (status) => {
    switch (status) {
      case 'ourTeam':
        return 'صوت لنا';
      case 'otherTeam':
        return 'صوت للآخرين';
      case 'notVoted':
        return 'لم يصوت';
      default:
        return '';
    }
  };

  // Reset all data function
  const resetAllData = () => {
    if (
      window.confirm(
        'هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم فقدان جميع بيانات التصويت.'
      )
    ) {
      localStorage.removeItem('electorsData');
      localStorage.removeItem('electionResults');
      window.location.reload();
    }
  };

  // Prepare data for charts
  const pieChartData = [
    { name: 'فريقنا', value: results.ourTeam, color: '#10B981' },
    { name: 'الفريق الآخر', value: results.otherTeam, color: '#EF4444' },
    { name: 'لم يصوتوا', value: results.notVoted, color: '#9CA3AF' },
  ];

  const barChartData = [
    { name: 'فريقنا', votes: results.ourTeam, color: '#10B981' },
    { name: 'الفريق الآخر', votes: results.otherTeam, color: '#EF4444' },
    { name: 'لم يصوتوا', votes: results.notVoted, color: '#9CA3AF' },
  ];
  return (
    <div className='p-6' dir='rtl'>
      {/* الرأس */}
      <div className='mb-8 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          لوحة معلومات الانتخابات
        </h1>
        <p className='text-gray-600'>
          إدارة ومتابعة عملية التصويت لبلدية برج الملوك
        </p>
        <div className='flex space-x-2'>
          <button
            onClick={navigateToDataViewer}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium ml-2'
          >
            <Database className='ml-1 h-4 w-4 inline' />
            عرض البيانات المصنفة
          </button>
          <button
            onClick={handleLogout}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium'
          >
            <LogOut className='ml-1 h-4 w-4 inline' />
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* بطاقات النتائج */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-md border-r-4 border-green-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>فريقنا</p>
              <h2 className='text-2xl font-bold text-gray-800'>
                {results.ourTeam}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {results.total > 0
                  ? Math.round((results.ourTeam / results.total) * 100)
                  : 0}
                % من الأصوات
              </p>
            </div>
            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-green-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md border-r-4 border-red-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>الفريق الآخر</p>
              <h2 className='text-2xl font-bold text-gray-800'>
                {results.otherTeam}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {results.total > 0
                  ? Math.round((results.otherTeam / results.total) * 100)
                  : 0}
                % من الأصوات
              </p>
            </div>
            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <XCircle className='w-6 h-6 text-red-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md border-r-4 border-gray-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>لم يصوتوا بعد</p>
              <h2 className='text-2xl font-bold text-gray-800'>
                {results.notVoted}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {results.total > 0
                  ? Math.round((results.notVoted / results.total) * 100)
                  : 0}
                % من الناخبين
              </p>
            </div>
            <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
              <User className='w-6 h-6 text-gray-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md border-r-4 border-blue-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>إجمالي الناخبين</p>
              <h2 className='text-2xl font-bold text-gray-800'>
                {results.total}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                في دائرة برج الملوك الانتخابية
              </p>
            </div>
            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='w-6 h-6 text-blue-500' />
            </div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div className='relative flex-1'>
            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              className='block w-full pr-10 py-2 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-right'
              placeholder='البحث عن ناخب (الاسم، العائلة، الملاحظات)'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex-shrink-0'>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5 text-gray-400' />
              <select
                className='py-2 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value='all'>جميع الناخبين</option>
                <option value='voted'>الذين صوتوا</option>
                <option value='notVoted'>الذين لم يصوتوا</option>
                <option value='votedForUs'>صوتوا لنا</option>
                <option value='votedForThem'>صوتوا للآخرين</option>
              </select>
            </div>
          </div>
        </div>

        {/* رسم بياني للنتائج */}
        <div className='mb-6'>
          <h3 className='text-md font-medium text-gray-700 mb-2'>
            توزيع الأصوات
          </h3>
          <div className='h-4 bg-gray-200 rounded-full overflow-hidden'>
            <div className='flex h-full'>
              {results.total > 0 && (
                <>
                  <div
                    className='bg-green-500 transition-all duration-500 ease-in-out'
                    style={{
                      width: `${(results.ourTeam / results.total) * 100}%`,
                    }}
                  ></div>
                  <div
                    className='bg-red-500 transition-all duration-500 ease-in-out'
                    style={{
                      width: `${(results.otherTeam / results.total) * 100}%`,
                    }}
                  ></div>
                  <div
                    className='bg-gray-400 transition-all duration-500 ease-in-out'
                    style={{
                      width: `${(results.notVoted / results.total) * 100}%`,
                    }}
                  ></div>
                </>
              )}
            </div>
          </div>
          <div className='flex justify-between mt-2 text-xs text-gray-600'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-1'></div>
              <span>فريقنا ({results.ourTeam})</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-red-500 rounded-full mr-1'></div>
              <span>الفريق الآخر ({results.otherTeam})</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-gray-400 rounded-full mr-1'></div>
              <span>لم يصوتوا ({results.notVoted})</span>
            </div>
          </div>
        </div>
      </div>

      {/* المخططات البيانية */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-700'>
            المخططات البيانية للنتائج
          </h3>
          <div className='flex space-x-2'>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                chartType === 'pie'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <PieChart className='h-4 w-4 inline mr-1' />
              دائري
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                chartType === 'bar'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <BarChart className='h-4 w-4 inline mr-1' />
              شريطي
            </button>
          </div>
        </div>

        <div className='h-72'>
          {chartType === 'pie' ? (
            <ResponsiveContainer width='100%' height='100%'>
              <RechartsPlePieChart>
                <Pie
                  data={pieChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ناخب`, '']} />
                <Legend />
              </RechartsPlePieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width='100%' height='100%'>
              <RechartsBarChart
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ناخب`, '']} />
                <Legend />
                <Bar dataKey='votes' name='عدد الناخبين'>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* جدول الناخبين */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {error && (
          <div className='p-4 bg-yellow-100 text-yellow-700 text-center'>
            {error}
          </div>
        )}
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  الاسم
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  اسم الأب
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  اسم الأم
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  تاريخ الولادة
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  الديانة
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  عدد العائلة
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  حالة التصويت
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  ملاحظات
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
              {loading ? (
                <tr>
                  <td colSpan='9' className='px-6 py-4 text-center'>
                    <div className='flex justify-center'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
                    </div>
                    <p className='mt-2 text-sm text-gray-500'>
                      جاري تحميل البيانات...
                    </p>
                  </td>
                </tr>
              ) : filteredElectors.length === 0 ? (
                <tr>
                  <td
                    colSpan='9'
                    className='px-6 py-4 text-center text-sm text-gray-500'
                  >
                    لم يتم العثور على ناخبين مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredElectors.map((elector) => (
                  <tr key={elector.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {elector.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {elector.fatherName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {elector.motherName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {elector.dateOfBirth}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {elector.religion}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                      {elector.familyNumber}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {getVoteStatusBadge(elector.voteStatus)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {elector.notes}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
                      <div className='flex space-x-2 justify-end'>
                        <button
                          onClick={() =>
                            openConfirmationModal(elector.id, 'ourTeam')
                          }
                          className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                            elector.voteStatus === 'ourTeam'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          صوت لنا
                        </button>
                        <button
                          onClick={() =>
                            openConfirmationModal(elector.id, 'otherTeam')
                          }
                          className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                            elector.voteStatus === 'otherTeam'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          صوت للآخرين
                        </button>
                        <button
                          onClick={() =>
                            openConfirmationModal(elector.id, 'notVoted')
                          }
                          className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                            elector.voteStatus === 'notVoted'
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          لم يصوت
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                تأكيد تغيير حالة التصويت
              </h3>
              <button
                onClick={closeConfirmationModal}
                className='text-gray-400 hover:text-gray-500'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='mb-6'>
              <div className='flex items-center justify-center mb-4'>
                <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                  <AlertTriangle className='h-6 w-6 text-yellow-500' />
                </div>
              </div>
              <p className='text-center text-gray-700 mb-2'>
                هل أنت متأكد من تغيير حالة تصويت الناخب
              </p>
              <p className='text-center font-semibold text-gray-900 mb-2'>
                {confirmElector?.name}
              </p>
              <p className='text-center text-gray-700 mb-1'>
                من:{' '}
                <span className='font-medium'>
                  {getVoteStatusText(confirmElector?.voteStatus)}
                </span>
              </p>
              <p className='text-center text-gray-700'>
                إلى:{' '}
                <span className='font-medium'>
                  {getVoteStatusText(confirmStatus)}
                </span>
              </p>
            </div>
            <div className='flex justify-center space-x-2'>
              <button
                onClick={closeConfirmationModal}
                className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ml-2'
              >
                إلغاء
              </button>
              <button
                onClick={handleVoteStatusChange}
                className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionsDashboard;
