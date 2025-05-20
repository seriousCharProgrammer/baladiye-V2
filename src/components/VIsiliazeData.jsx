// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   CheckCircle,
//   XCircle,
//   User,
//   PieChart,
//   BarChart,
//   AlertTriangle,
//   X,
//   ArrowLeft,
//   Search,
//   Filter,
// } from 'lucide-react';
// import {
//   PieChart as RechartsPlePieChart,
//   Pie,
//   Cell,
//   BarChart as RechartsBarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import votersData2 from './votersData2';

// export default function CategorizedDataViewer() {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('لنا');
//   const [chartType, setChartType] = useState('pie');
//   const [votingResults, setVotingResults] = useState({
//     ourTeam: 0,
//     otherTeam: 0,
//     notVoted: 0,
//     total: 0,
//   });
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmPerson, setConfirmPerson] = useState(null);
//   const [confirmStatus, setConfirmStatus] = useState('');

//   // New state for search and filter functionality
//   const [searchTerm, setSearchTerm] = useState('');
//   const [voteStatusFilter, setVoteStatusFilter] = useState('all');
//   const [filteredData, setFilteredData] = useState([]);

//   // Chart data
//   const pieChartData = [
//     { name: 'فريقنا', value: votingResults.ourTeam, color: '#10B981' },
//     { name: 'الفريق الآخر', value: votingResults.otherTeam, color: '#EF4444' },
//     { name: 'لم يصوتوا', value: votingResults.notVoted, color: '#9CA3AF' },
//   ];

//   const barChartData = [
//     { name: 'فريقنا', votes: votingResults.ourTeam, color: '#10B981' },
//     { name: 'الفريق الآخر', votes: votingResults.otherTeam, color: '#EF4444' },
//     { name: 'لم يصوتوا', votes: votingResults.notVoted, color: '#9CA3AF' },
//   ];

//   // Function to navigate back to dashboard
//   const goBackToDashboard = () => {
//     navigate('/electionsDashboard');
//   };

//   // Function to update voting results
//   const updateVotingResults = (data) => {
//     if (!data) return;

//     const allRows = [
//       ...data.لنا,
//       ...data.لهم,
//       ...data.حكومة,
//       ...data.أجانب,
//       ...data.غير_معروف,
//     ];

//     const ourTeamCount = allRows.filter(
//       (row) => row.voteStatus === 'ourTeam'
//     ).length;
//     const otherTeamCount = allRows.filter(
//       (row) => row.voteStatus === 'otherTeam'
//     ).length;
//     const notVotedCount = allRows.filter(
//       (row) => row.voteStatus === 'notVoted'
//     ).length;

//     const newResults = {
//       ourTeam: ourTeamCount,
//       otherTeam: otherTeamCount,
//       notVoted: notVotedCount,
//       total: allRows.length,
//     };

//     setVotingResults(newResults);
//   };

//   // Function to handle vote status change
//   const handleVoteStatusChange = () => {
//     if (!confirmPerson || !confirmStatus) return;

//     // Update the data state
//     const newData = { ...data };

//     // Find the person in the appropriate category
//     Object.keys(newData).forEach((category) => {
//       newData[category] = newData[category].map((person) => {
//         if (person.id === confirmPerson.id) {
//           return { ...person, voteStatus: confirmStatus };
//         }
//         return person;
//       });
//     });

//     setData(newData);

//     // Update localStorage with the voting data
//     const votingStatusMap = localStorage.getItem('categorizedVotingData')
//       ? JSON.parse(localStorage.getItem('categorizedVotingData'))
//       : {};

//     votingStatusMap[confirmPerson.id] = confirmStatus;
//     localStorage.setItem(
//       'categorizedVotingData',
//       JSON.stringify(votingStatusMap)
//     );

//     // Update voting results
//     updateVotingResults(newData);

//     // Close the modal
//     closeConfirmationModal();
//   };

//   // Open confirmation modal
//   const openConfirmationModal = (person, newStatus) => {
//     setConfirmPerson(person);
//     setConfirmStatus(newStatus);
//     setShowConfirmModal(true);
//   };

//   // Close confirmation modal
//   const closeConfirmationModal = () => {
//     setShowConfirmModal(false);
//     setConfirmPerson(null);
//     setConfirmStatus('');
//   };

//   // Helper function to get vote status badge
//   const getVoteStatusBadge = (status) => {
//     switch (status) {
//       case 'ourTeam':
//         return (
//           <span className='bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium'>
//             صوت لنا
//           </span>
//         );
//       case 'otherTeam':
//         return (
//           <span className='bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium'>
//             صوت للآخرين
//           </span>
//         );
//       case 'notVoted':
//         return (
//           <span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium'>
//             لم يصوت
//           </span>
//         );
//       default:
//         return null;
//     }
//   };

//   // Helper function to get vote status text
//   const getVoteStatusText = (status) => {
//     switch (status) {
//       case 'ourTeam':
//         return 'صوت لنا';
//       case 'otherTeam':
//         return 'صوت للآخرين';
//       case 'notVoted':
//         return 'لم يصوت';
//       default:
//         return '';
//     }
//   };

//   // New function to handle search term changes
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // New function to handle vote status filter changes
//   const handleVoteStatusFilterChange = (filter) => {
//     setVoteStatusFilter(filter);
//   };

//   // Apply search and filters to data
//   useEffect(() => {
//     if (!data || !data[activeTab]) return;

//     let result = [...data[activeTab]];

//     // Apply vote status filter
//     if (voteStatusFilter !== 'all') {
//       result = result.filter(
//         (person) => person.voteStatus === voteStatusFilter
//       );
//     }

//     // Apply search term filter if search term is not empty
//     if (searchTerm.trim() !== '') {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (person) =>
//           (person.name && person.name.toLowerCase().includes(term)) ||
//           (person.fatherName &&
//             person.fatherName.toLowerCase().includes(term)) ||
//           (person.motherName &&
//             person.motherName.toLowerCase().includes(term)) ||
//           (person.birthdate && person.birthdate.toLowerCase().includes(term)) ||
//           (person['family Number'] &&
//             person['family Number'].toString().includes(term)) ||
//           (person.details && person.details.toLowerCase().includes(term))
//       );
//     }

//     setFilteredData(result);
//   }, [data, activeTab, searchTerm, voteStatusFilter]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         // Fetch data from the JSON file using fetch API

//         // Parse the JSON response
//         const jsonData = votersData2;

//         // Create the categorized structure with Arabic keys
//         let result = {
//           لنا: [], // forUs (yellow)
//           لهم: [], // forThem (green)
//           حكومة: [], // Goverment (orange)
//           أجانب: [], // Foreginers (blue)
//           غير_معروف: [], // Unknown (white/none)
//         };

//         // Map English categories to Arabic
//         if (jsonData.forUs) result.لنا = jsonData.forUs;
//         if (jsonData.forThem) result.لهم = jsonData.forThem;
//         if (jsonData.Goverment) result.حكومة = jsonData.Goverment;
//         if (jsonData.Foreginers) result.أجانب = jsonData.Foreginers;
//         if (jsonData.Unknown) result.غير_معروف = jsonData.Unknown;

//         // Add voting status to each row
//         const savedVotingData = localStorage.getItem('categorizedVotingData');
//         let votingStatusMap = {};

//         if (savedVotingData) {
//           votingStatusMap = JSON.parse(savedVotingData);
//         }

//         // Apply voting statuses and ensure each entry has an ID
//         Object.keys(result).forEach((category) => {
//           result[category] = result[category].map((row, index) => {
//             // Ensure the row has an ID
//             if (!row.id) {
//               row.id = `${category}-${index + 1}`;
//             }

//             // Apply voting status
//             row.voteStatus = votingStatusMap[row.id] || 'notVoted';
//             return row;
//           });
//         });

//         setData(result);
//         updateVotingResults(result);
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('فشل تحميل البيانات: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Colors for the categories
//   const categoryColors = {
//     لنا: 'bg-yellow-100',
//     لهم: 'bg-green-100',
//     حكومة: 'bg-orange-100',
//     أجانب: 'bg-blue-100',
//     غير_معروف: 'bg-gray-100',
//   };

//   if (loading)
//     return <div className='p-4 text-center'>جاري تحميل البيانات...</div>;
//   if (error) return <div className='p-4 text-red-500'>{error}</div>;
//   if (!data) return <div className='p-4 text-center'>لا توجد بيانات متاحة</div>;

//   const categoryData = data[activeTab] || [];
//   const categoryCounts = {
//     لنا: data.لنا.length,
//     لهم: data.لهم.length,
//     حكومة: data.حكومة.length,
//     أجانب: data.أجانب.length,
//     غير_معروف: data.غير_معروف.length,
//   };

//   // Determine which data to show based on filters
//   const displayData = filteredData.length > 0 ? filteredData : categoryData;

//   return (
//     <div className='p-4' dir='rtl'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-xl font-bold text-right'>
//           البيانات المصنفة من ملف JSON
//         </h1>
//         <button
//           onClick={goBackToDashboard}
//           className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium'
//         >
//           <ArrowLeft className='ml-1 h-4 w-4 inline' />
//           العودة إلى لوحة التحكم
//         </button>
//       </div>

//       {/* بطاقات النتائج */}
//       <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
//         <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-green-500'>
//           <div className='flex items-center justify-between'>
//             <div>
//               <p className='text-sm text-gray-600 mb-1'>فريقنا</p>
//               <h2 className='text-xl font-bold text-gray-800'>
//                 {votingResults.ourTeam}
//               </h2>
//               <p className='text-xs text-gray-500 mt-1'>
//                 {votingResults.total > 0
//                   ? Math.round(
//                       (votingResults.ourTeam / votingResults.total) * 100
//                     )
//                   : 0}
//                 % من الأصوات
//               </p>
//             </div>
//             <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
//               <CheckCircle className='w-6 h-6 text-green-500' />
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-red-500'>
//           <div className='flex items-center justify-between'>
//             <div>
//               <p className='text-sm text-gray-600 mb-1'>الفريق الآخر</p>
//               <h2 className='text-xl font-bold text-gray-800'>
//                 {votingResults.otherTeam}
//               </h2>
//               <p className='text-xs text-gray-500 mt-1'>
//                 {votingResults.total > 0
//                   ? Math.round(
//                       (votingResults.otherTeam / votingResults.total) * 100
//                     )
//                   : 0}
//                 % من الأصوات
//               </p>
//             </div>
//             <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
//               <XCircle className='w-6 h-6 text-red-500' />
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-gray-500'>
//           <div className='flex items-center justify-between'>
//             <div>
//               <p className='text-sm text-gray-600 mb-1'>لم يصوتوا بعد</p>
//               <h2 className='text-xl font-bold text-gray-800'>
//                 {votingResults.notVoted}
//               </h2>
//               <p className='text-xs text-gray-500 mt-1'>
//                 {votingResults.total > 0
//                   ? Math.round(
//                       (votingResults.notVoted / votingResults.total) * 100
//                     )
//                   : 0}
//                 % من الناخبين
//               </p>
//             </div>
//             <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
//               <User className='w-6 h-6 text-gray-500' />
//             </div>
//           </div>
//         </div>

//         <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-500'>
//           <div className='flex items-center justify-between'>
//             <div>
//               <p className='text-sm text-gray-600 mb-1'>إجمالي الناخبين</p>
//               <h2 className='text-xl font-bold text-gray-800'>
//                 {votingResults.total}
//               </h2>
//               <p className='text-xs text-gray-500 mt-1'>في جميع الفئات</p>
//             </div>
//             <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
//               <User className='w-6 h-6 text-blue-500' />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* رسم بياني للنتائج */}
//       <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
//         <h3 className='text-md font-medium text-gray-700 mb-2'>
//           توزيع الأصوات
//         </h3>
//         <div className='h-4 bg-gray-200 rounded-full overflow-hidden mb-2'>
//           <div className='flex h-full'>
//             {votingResults.total > 0 && (
//               <>
//                 <div
//                   className='bg-green-500 transition-all duration-500 ease-in-out'
//                   style={{
//                     width: `${
//                       (votingResults.ourTeam / votingResults.total) * 100
//                     }%`,
//                   }}
//                 ></div>
//                 <div
//                   className='bg-red-500 transition-all duration-500 ease-in-out'
//                   style={{
//                     width: `${
//                       (votingResults.otherTeam / votingResults.total) * 100
//                     }%`,
//                   }}
//                 ></div>
//                 <div
//                   className='bg-gray-400 transition-all duration-500 ease-in-out'
//                   style={{
//                     width: `${
//                       (votingResults.notVoted / votingResults.total) * 100
//                     }%`,
//                   }}
//                 ></div>
//               </>
//             )}
//           </div>
//         </div>
//         <div className='flex justify-between mt-2 text-xs text-gray-600'>
//           <div className='flex items-center'>
//             <div className='w-3 h-3 bg-green-500 rounded-full ml-1'></div>
//             <span>فريقنا ({votingResults.ourTeam})</span>
//           </div>
//           <div className='flex items-center'>
//             <div className='w-3 h-3 bg-red-500 rounded-full ml-1'></div>
//             <span>الفريق الآخر ({votingResults.otherTeam})</span>
//           </div>
//           <div className='flex items-center'>
//             <div className='w-3 h-3 bg-gray-400 rounded-full ml-1'></div>
//             <span>لم يصوتوا ({votingResults.notVoted})</span>
//           </div>
//         </div>
//       </div>

//       {/* المخططات البيانية */}
//       <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
//         <div className='flex justify-between items-center mb-4'>
//           <h3 className='text-lg font-medium text-gray-700'>
//             المخططات البيانية للنتائج
//           </h3>
//           <div className='flex space-x-2'>
//             <button
//               onClick={() => setChartType('pie')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 chartType === 'pie'
//                   ? 'bg-green-500 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               <PieChart className='h-4 w-4 inline ml-1' />
//               دائري
//             </button>
//             <button
//               onClick={() => setChartType('bar')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 chartType === 'bar'
//                   ? 'bg-green-500 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               <BarChart className='h-4 w-4 inline ml-1' />
//               شريطي
//             </button>
//           </div>
//         </div>

//         <div className='h-64'>
//           {chartType === 'pie' ? (
//             <ResponsiveContainer width='100%' height='100%'>
//               <RechartsPlePieChart>
//                 <Pie
//                   data={pieChartData}
//                   cx='50%'
//                   cy='50%'
//                   labelLine={true}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={80}
//                   fill='#8884d8'
//                   dataKey='value'
//                 >
//                   {pieChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`${value} ناخب`, '']} />
//                 <Legend />
//               </RechartsPlePieChart>
//             </ResponsiveContainer>
//           ) : (
//             <ResponsiveContainer width='100%' height='100%'>
//               <RechartsBarChart
//                 data={barChartData}
//                 margin={{
//                   top: 5,
//                   right: 30,
//                   left: 20,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray='3 3' />
//                 <XAxis dataKey='name' />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`${value} ناخب`, '']} />
//                 <Legend />
//                 <Bar dataKey='votes' name='عدد الناخبين'>
//                   {barChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </RechartsBarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Search and Filter Section - NEW */}
//       <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
//         <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//           {/* Search Input */}
//           <div className='relative w-full md:w-1/2'>
//             <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
//               <Search className='h-5 w-5 text-gray-400' />
//             </div>
//             <input
//               type='text'
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className='block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right'
//               placeholder='البحث بالاسم، اسم الأب، رقم العائلة، إلخ...'
//             />
//           </div>

//           {/* Filter Buttons */}
//           <div className='flex items-center space-x-2 w-full md:w-auto'>
//             <span className='text-gray-700 flex items-center ml-2'>
//               <Filter className='h-4 w-4 mr-1' />
//               تصفية:
//             </span>
//             <button
//               onClick={() => handleVoteStatusFilterChange('all')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 voteStatusFilter === 'all'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               الكل
//             </button>
//             <button
//               onClick={() => handleVoteStatusFilterChange('ourTeam')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 voteStatusFilter === 'ourTeam'
//                   ? 'bg-green-500 text-white'
//                   : 'bg-green-100 text-green-800 hover:bg-green-200'
//               }`}
//             >
//               صوت لنا
//             </button>
//             <button
//               onClick={() => handleVoteStatusFilterChange('otherTeam')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 voteStatusFilter === 'otherTeam'
//                   ? 'bg-red-500 text-white'
//                   : 'bg-red-100 text-red-800 hover:bg-red-200'
//               }`}
//             >
//               صوت للآخرين
//             </button>
//             <button
//               onClick={() => handleVoteStatusFilterChange('notVoted')}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 voteStatusFilter === 'notVoted'
//                   ? 'bg-gray-500 text-white'
//                   : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//               }`}
//             >
//               لم يصوت
//             </button>
//           </div>
//         </div>

//         {/* Search Results Info */}
//         <div className='mt-3 text-sm text-gray-600'>
//           {searchTerm || voteStatusFilter !== 'all' ? (
//             <div className='flex items-center'>
//               <span>نتائج البحث: {filteredData.length} سجل</span>
//               {(searchTerm || voteStatusFilter !== 'all') && (
//                 <button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setVoteStatusFilter('all');
//                   }}
//                   className='mr-2 text-blue-500 hover:text-blue-700 text-xs underline flex items-center'
//                 >
//                   <X className='h-3 w-3 mr-1' />
//                   مسح التصفية
//                 </button>
//               )}
//             </div>
//           ) : (
//             <span>إجمالي السجلات: {categoryData.length}</span>
//           )}
//         </div>
//       </div>

//       {/* Category Stats */}
//       <div className='mb-4 grid grid-cols-5 gap-2'>
//         {Object.entries(categoryCounts).map(([category, count]) => (
//           <div
//             key={category}
//             className={`${
//               categoryColors[category]
//             } p-2 rounded cursor-pointer ${
//               activeTab === category ? 'ring-2 ring-blue-500' : ''
//             }`}
//             onClick={() => setActiveTab(category)}
//           >
//             <div className='font-semibold'>{category}</div>
//             <div>{count} سجل</div>
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className='overflow-x-auto'>
//         <table className='min-w-full bg-white border border-gray-300'>
//           <thead>
//             <tr className='bg-gray-100'>
//               <th className='border px-4 py-2'>الاسم</th>
//               <th className='border px-4 py-2'>اسم الأب</th>
//               <th className='border px-4 py-2'>اسم الأم</th>
//               <th className='border px-4 py-2'>تاريخ الميلاد</th>
//               <th className='border px-4 py-2'>الديانة</th>
//               <th className='border px-4 py-2'>رقم العائلة</th>
//               <th className='border px-4 py-2'>تفاصيل</th>
//               <th className='border px-4 py-2'>حالة التصويت</th>
//               <th className='border px-4 py-2'>الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayData.length > 0 ? (
//               displayData.slice(0, 50).map((row, index) => (
//                 <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
//                   <td className='border px-4 py-2'>{row.name}</td>
//                   <td className='border px-4 py-2'>{row.fatherName}</td>
//                   <td className='border px-4 py-2'>{row.motherName}</td>
//                   <td className='border px-4 py-2'>{row.birthdate}</td>
//                   <td className='border px-4 py-2'>{row.relegion}</td>
//                   <td className='border px-4 py-2'>{row['family Number']}</td>
//                   <td className='border px-4 py-2'>{row.details}</td>
//                   <td className='border px-4 py-2'>
//                     {getVoteStatusBadge(row.voteStatus)}
//                   </td>
//                   <td className='border px-4 py-2'>
//                     <div className='flex space-x-1 justify-end'>
//                       <button
//                         onClick={() => openConfirmationModal(row, 'ourTeam')}
//                         className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
//                           row.voteStatus === 'ourTeam'
//                             ? 'bg-green-600 text-white'
//                             : 'bg-green-100 text-green-800 hover:bg-green-200'
//                         }`}
//                       >
//                         صوت لنا
//                       </button>
//                       <button
//                         onClick={() => openConfirmationModal(row, 'otherTeam')}
//                         className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
//                           row.voteStatus === 'otherTeam'
//                             ? 'bg-red-600 text-white'
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'
//                         }`}
//                       >
//                         صوت للآخرين
//                       </button>
//                       <button
//                         onClick={() => openConfirmationModal(row, 'notVoted')}
//                         className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
//                           row.voteStatus === 'notVoted'
//                             ? 'bg-gray-600 text-white'
//                             : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                         }`}
//                       >
//                         لم يصوت
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan='9' className='border px-4 py-2 text-center'>
//                   {searchTerm || voteStatusFilter !== 'all'
//                     ? 'لا توجد نتائج مطابقة لمعايير البحث'
//                     : 'لا توجد سجلات في هذه الفئة'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {displayData.length > 50 && (
//           <div className='mt-2 text-gray-500'>
//             يتم عرض 50 من أصل {displayData.length} سجل
//           </div>
//         )}
//       </div>

//       <div className='mt-8'>
//         <h2 className='text-lg font-semibold mb-2 text-right'>
//           معاينة هيكل JSON
//         </h2>
//         <pre className='bg-gray-100 p-4 rounded overflow-auto max-h-64 text-xs text-right'>
//           {`{
//   "لنا": [ /* ${data.لنا.length} سجل */ ],         // forUs (yellow)
//   "لهم": [ /* ${data.لهم.length} سجل */ ],         // forThem (green)
//   "حكومة": [ /* ${data.حكومة.length} سجل */ ],     // Goverment (orange)
//   "أجانب": [ /* ${data.أجانب.length} سجل */ ],     // Foreginers (blue)
//   "غير_معروف": [ /* ${data.غير_معروف.length} سجل */ ] // Unknown (white/none)
// }`}
//         </pre>
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmModal && (
//         <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
//           <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
//             <div className='flex justify-between items-center mb-4'>
//               <h3 className='text-lg font-medium text-gray-900'>
//                 تأكيد تغيير حالة التصويت
//               </h3>
//               <button
//                 onClick={closeConfirmationModal}
//                 className='text-gray-400 hover:text-gray-500'
//               >
//                 <X className='h-5 w-5' />
//               </button>
//             </div>
//             <div className='mb-6'>
//               <div className='flex items-center justify-center mb-4'>
//                 <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
//                   <AlertTriangle className='h-6 w-6 text-yellow-500' />
//                 </div>
//               </div>
//               <p className='text-center text-gray-700 mb-2'>
//                 هل أنت متأكد من تغيير حالة تصويت
//               </p>
//               <p className='text-center font-semibold text-gray-900 mb-2'>
//                 {confirmPerson?.name}
//               </p>
//               <p className='text-center text-gray-700 mb-1'>
//                 من:{' '}
//                 <span className='font-medium'>
//                   {getVoteStatusText(confirmPerson?.voteStatus)}
//                 </span>
//               </p>
//               <p className='text-center text-gray-700'>
//                 إلى:{' '}
//                 <span className='font-medium'>
//                   {getVoteStatusText(confirmStatus)}
//                 </span>
//               </p>
//             </div>
//             <div className='flex justify-center space-x-2'>
//               <button
//                 onClick={closeConfirmationModal}
//                 className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ml-2'
//               >
//                 إلغاء
//               </button>
//               <button
//                 onClick={handleVoteStatusChange}
//                 className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
//               >
//                 تأكيد
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  User,
  PieChart,
  BarChart,
  AlertTriangle,
  X,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
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
import votersData2 from './votersData2';

export default function CategorizedDataViewer() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('لنا');
  const [chartType, setChartType] = useState('pie');
  const [votingResults, setVotingResults] = useState({
    ourTeam: 0,
    otherTeam: 0,
    notVoted: 0,
    total: 0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmPerson, setConfirmPerson] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState('');

  // New state for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [voteStatusFilter, setVoteStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  // Chart data
  const pieChartData = [
    { name: 'فريقنا', value: votingResults.ourTeam, color: '#10B981' },
    { name: 'الفريق الآخر', value: votingResults.otherTeam, color: '#EF4444' },
    { name: 'لم يصوتوا', value: votingResults.notVoted, color: '#9CA3AF' },
  ];

  const barChartData = [
    { name: 'فريقنا', votes: votingResults.ourTeam, color: '#10B981' },
    { name: 'الفريق الآخر', votes: votingResults.otherTeam, color: '#EF4444' },
    { name: 'لم يصوتوا', votes: votingResults.notVoted, color: '#9CA3AF' },
  ];

  // Function to navigate back to dashboard
  const goBackToDashboard = () => {
    navigate('/electionsDashboard');
  };

  // Function to update voting results and save to localStorage
  const updateVotingResults = (data) => {
    if (!data) return;

    const allRows = [
      ...data.لنا,
      ...data.لهم,
      ...data.حكومة,
      ...data.أجانب,
      ...data.غير_معروف,
    ];

    const ourTeamCount = allRows.filter(
      (row) => row.voteStatus === 'ourTeam'
    ).length;
    const otherTeamCount = allRows.filter(
      (row) => row.voteStatus === 'otherTeam'
    ).length;
    const notVotedCount = allRows.filter(
      (row) => row.voteStatus === 'notVoted'
    ).length;

    const newResults = {
      ourTeam: ourTeamCount,
      otherTeam: otherTeamCount,
      notVoted: notVotedCount,
      total: allRows.length,
    };

    setVotingResults(newResults);

    // Save voting results to localStorage
    localStorage.setItem('votingResults', JSON.stringify(newResults));
  };

  // Function to handle vote status change
  const handleVoteStatusChange = () => {
    if (!confirmPerson || !confirmStatus) return;

    // Update the data state
    const newData = { ...data };

    // Find the person in the appropriate category
    Object.keys(newData).forEach((category) => {
      newData[category] = newData[category].map((person) => {
        if (person.id === confirmPerson.id) {
          return { ...person, voteStatus: confirmStatus };
        }
        return person;
      });
    });

    setData(newData);

    // Save complete election data to localStorage
    localStorage.setItem('categorizedData', JSON.stringify(newData));

    // Update localStorage with the individual voting status
    const votingStatusMap = localStorage.getItem('categorizedVotingData')
      ? JSON.parse(localStorage.getItem('categorizedVotingData'))
      : {};

    votingStatusMap[confirmPerson.id] = confirmStatus;
    localStorage.setItem(
      'categorizedVotingData',
      JSON.stringify(votingStatusMap)
    );

    // Update voting results
    updateVotingResults(newData);

    // Close the modal
    closeConfirmationModal();
  };

  // Open confirmation modal
  const openConfirmationModal = (person, newStatus) => {
    setConfirmPerson(person);
    setConfirmStatus(newStatus);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmModal(false);
    setConfirmPerson(null);
    setConfirmStatus('');
  };

  // Helper function to get vote status badge
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

  // Helper function to get vote status text
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

  // Function to handle search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Function to handle vote status filter changes
  const handleVoteStatusFilterChange = (filter) => {
    setVoteStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Function to handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Apply search and filters to data
  useEffect(() => {
    if (!data || !data[activeTab]) return;

    let result = [...data[activeTab]];

    // Apply vote status filter
    if (voteStatusFilter !== 'all') {
      result = result.filter(
        (person) => person.voteStatus === voteStatusFilter
      );
    }

    // Apply search term filter if search term is not empty
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (person) =>
          (person.name && person.name.toLowerCase().includes(term)) ||
          (person.fatherName &&
            person.fatherName.toLowerCase().includes(term)) ||
          (person.motherName &&
            person.motherName.toLowerCase().includes(term)) ||
          (person.birthdate && person.birthdate.toLowerCase().includes(term)) ||
          (person['family Number'] &&
            person['family Number'].toString().includes(term)) ||
          (person.details && person.details.toLowerCase().includes(term))
      );
    }

    setFilteredData(result);
    setTotalPages(Math.ceil(result.length / rowsPerPage));

    // When switching tabs or filters, ensure current page is valid
    if (currentPage > Math.ceil(result.length / rowsPerPage)) {
      setCurrentPage(1);
    }
  }, [data, activeTab, searchTerm, voteStatusFilter, rowsPerPage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Check if data exists in localStorage first
        const savedData = localStorage.getItem('categorizedData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setData(parsedData);
          updateVotingResults(parsedData);
          setLoading(false);
          return;
        }

        // If no saved data, fetch from the JSON file
        const jsonData = votersData2;

        // Create the categorized structure with Arabic keys
        let result = {
          لنا: [], // forUs (yellow)
          لهم: [], // forThem (green)
          حكومة: [], // Goverment (orange)
          أجانب: [], // Foreginers (blue)
          غير_معروف: [], // Unknown (white/none)
        };

        // Map English categories to Arabic
        if (jsonData.forUs) result.لنا = jsonData.forUs;
        if (jsonData.forThem) result.لهم = jsonData.forThem;
        if (jsonData.Goverment) result.حكومة = jsonData.Goverment;
        if (jsonData.Foreginers) result.أجانب = jsonData.Foreginers;
        if (jsonData.Unknown) result.غير_معروف = jsonData.Unknown;

        // Add voting status to each row
        const savedVotingData = localStorage.getItem('categorizedVotingData');
        let votingStatusMap = {};

        if (savedVotingData) {
          votingStatusMap = JSON.parse(savedVotingData);
        }

        // Apply voting statuses and ensure each entry has an ID
        Object.keys(result).forEach((category) => {
          result[category] = result[category].map((row, index) => {
            // Ensure the row has an ID
            if (!row.id) {
              row.id = `${category}-${index + 1}`;
            }

            // Apply voting status
            row.voteStatus = votingStatusMap[row.id] || 'notVoted';
            return row;
          });
        });

        setData(result);
        updateVotingResults(result);

        // Save the complete data to localStorage
        localStorage.setItem('categorizedData', JSON.stringify(result));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('فشل تحميل البيانات: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Colors for the categories
  const categoryColors = {
    لنا: 'bg-yellow-100',
    لهم: 'bg-green-100',
    حكومة: 'bg-orange-100',
    أجانب: 'bg-blue-100',
    غير_معروف: 'bg-gray-100',
  };

  if (loading)
    return <div className='p-4 text-center'>جاري تحميل البيانات...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!data) return <div className='p-4 text-center'>لا توجد بيانات متاحة</div>;

  const categoryData = data[activeTab] || [];
  const categoryCounts = {
    لنا: data.لنا.length,
    لهم: data.لهم.length,
    حكومة: data.حكومة.length,
    أجانب: data.أجانب.length,
    غير_معروف: data.غير_معروف.length,
  };

  // Determine which data to show based on filters
  const displayData = filteredData.length > 0 ? filteredData : categoryData;

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = displayData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className='p-4' dir='rtl'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl font-bold text-right'>
          البيانات المصنفة من ملف JSON
        </h1>
        <button
          onClick={goBackToDashboard}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium'
        >
          <ArrowLeft className='ml-1 h-4 w-4 inline' />
          العودة إلى لوحة التحكم
        </button>
      </div>

      {/* بطاقات النتائج */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-green-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>فريقنا</p>
              <h2 className='text-xl font-bold text-gray-800'>
                {votingResults.ourTeam}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {votingResults.total > 0
                  ? Math.round(
                      (votingResults.ourTeam / votingResults.total) * 100
                    )
                  : 0}
                % من الأصوات
              </p>
            </div>
            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-green-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-red-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>الفريق الآخر</p>
              <h2 className='text-xl font-bold text-gray-800'>
                {votingResults.otherTeam}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {votingResults.total > 0
                  ? Math.round(
                      (votingResults.otherTeam / votingResults.total) * 100
                    )
                  : 0}
                % من الأصوات
              </p>
            </div>
            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <XCircle className='w-6 h-6 text-red-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-gray-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>لم يصوتوا بعد</p>
              <h2 className='text-xl font-bold text-gray-800'>
                {votingResults.notVoted}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>
                {votingResults.total > 0
                  ? Math.round(
                      (votingResults.notVoted / votingResults.total) * 100
                    )
                  : 0}
                % من الناخبين
              </p>
            </div>
            <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
              <User className='w-6 h-6 text-gray-500' />
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>إجمالي الناخبين</p>
              <h2 className='text-xl font-bold text-gray-800'>
                {votingResults.total}
              </h2>
              <p className='text-xs text-gray-500 mt-1'>في جميع الفئات</p>
            </div>
            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='w-6 h-6 text-blue-500' />
            </div>
          </div>
        </div>
      </div>

      {/* رسم بياني للنتائج */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
        <h3 className='text-md font-medium text-gray-700 mb-2'>
          توزيع الأصوات
        </h3>
        <div className='h-4 bg-gray-200 rounded-full overflow-hidden mb-2'>
          <div className='flex h-full'>
            {votingResults.total > 0 && (
              <>
                <div
                  className='bg-green-500 transition-all duration-500 ease-in-out'
                  style={{
                    width: `${
                      (votingResults.ourTeam / votingResults.total) * 100
                    }%`,
                  }}
                ></div>
                <div
                  className='bg-red-500 transition-all duration-500 ease-in-out'
                  style={{
                    width: `${
                      (votingResults.otherTeam / votingResults.total) * 100
                    }%`,
                  }}
                ></div>
                <div
                  className='bg-gray-400 transition-all duration-500 ease-in-out'
                  style={{
                    width: `${
                      (votingResults.notVoted / votingResults.total) * 100
                    }%`,
                  }}
                ></div>
              </>
            )}
          </div>
        </div>
        <div className='flex justify-between mt-2 text-xs text-gray-600'>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-green-500 rounded-full ml-1'></div>
            <span>فريقنا ({votingResults.ourTeam})</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-red-500 rounded-full ml-1'></div>
            <span>الفريق الآخر ({votingResults.otherTeam})</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-gray-400 rounded-full ml-1'></div>
            <span>لم يصوتوا ({votingResults.notVoted})</span>
          </div>
        </div>
      </div>

      {/* المخططات البيانية */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
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
              <PieChart className='h-4 w-4 inline ml-1' />
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
              <BarChart className='h-4 w-4 inline ml-1' />
              شريطي
            </button>
          </div>
        </div>

        <div className='h-64'>
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

      {/* Search and Filter Section */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          {/* Search Input */}
          <div className='relative w-full md:w-1/2'>
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              className='block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right'
              placeholder='البحث بالاسم، اسم الأب، رقم العائلة، إلخ...'
            />
          </div>

          {/* Filter Buttons */}
          <div className='flex items-center space-x-2 w-full md:w-auto'>
            <span className='text-gray-700 flex items-center ml-2'>
              <Filter className='h-4 w-4 mr-1' />
              تصفية:
            </span>
            <button
              onClick={() => handleVoteStatusFilterChange('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                voteStatusFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => handleVoteStatusFilterChange('ourTeam')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                voteStatusFilter === 'ourTeam'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              صوت لنا
            </button>
            <button
              onClick={() => handleVoteStatusFilterChange('otherTeam')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                voteStatusFilter === 'otherTeam'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              صوت للآخرين
            </button>
            <button
              onClick={() => handleVoteStatusFilterChange('notVoted')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                voteStatusFilter === 'notVoted'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              لم يصوت
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        <div className='mt-3 text-sm text-gray-600'>
          {searchTerm || voteStatusFilter !== 'all' ? (
            <div className='flex items-center'>
              <span>نتائج البحث: {filteredData.length} سجل</span>
              {(searchTerm || voteStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setVoteStatusFilter('all');
                  }}
                  className='mr-2 text-blue-500 hover:text-blue-700 text-xs underline flex items-center'
                >
                  <X className='h-3 w-3 mr-1' />
                  مسح التصفية
                </button>
              )}
            </div>
          ) : (
            <span>إجمالي السجلات: {categoryData.length}</span>
          )}
        </div>
      </div>

      {/* Category Stats */}
      <div className='mb-4 grid grid-cols-5 gap-2'>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div
            key={category}
            className={`${
              categoryColors[category]
            } p-2 rounded cursor-pointer ${
              activeTab === category ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setActiveTab(category);
              setCurrentPage(1); // Reset to page 1 when changing category
            }}
          >
            <div className='font-semibold'>{category}</div>
            <div>{count} سجل</div>
          </div>
        ))}
      </div>

      {/* Rows per page selector */}
      <div className='mb-4 flex justify-end items-center'>
        <label className='text-sm text-gray-600 ml-2'>عدد الصفوف:</label>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className='border border-gray-300 rounded-md text-sm p-1'
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-4 py-2'>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className='border px-4 py-2'>{row.name}</td>
                  <td className='border px-4 py-2'>{row.fatherName}</td>
                  <td className='border px-4 py-2'>{row.motherName}</td>
                  <td className='border px-4 py-2'>{row.birthdate}</td>
                  <td className='border px-4 py-2'>{row.relegion}</td>
                  <td className='border px-4 py-2'>{row['family Number']}</td>
                  <td className='border px-4 py-2'>{row.details}</td>
                  <td className='border px-4 py-2'>
                    {getVoteStatusBadge(row.voteStatus)}
                  </td>
                  <td className='border px-4 py-2'>
                    <div className='flex space-x-1 justify-end'>
                      <button
                        onClick={() => openConfirmationModal(row, 'ourTeam')}
                        className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                          row.voteStatus === 'ourTeam'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        صوت لنا
                      </button>
                      <button
                        onClick={() => openConfirmationModal(row, 'otherTeam')}
                        className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                          row.voteStatus === 'otherTeam'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        صوت للآخرين
                      </button>
                      <button
                        onClick={() => openConfirmationModal(row, 'notVoted')}
                        className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                          row.voteStatus === 'notVoted'
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
            ) : (
              <tr>
                <td colSpan='9' className='border px-4 py-2 text-center'>
                  {searchTerm || voteStatusFilter !== 'all'
                    ? 'لا توجد نتائج مطابقة لمعايير البحث'
                    : 'لا توجد سجلات في هذه الفئة'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {displayData.length > rowsPerPage && (
          <div className='mt-4 flex justify-between items-center'>
            <div className='text-sm text-gray-600'>
              عرض {indexOfFirstRow + 1} إلى{' '}
              {Math.min(indexOfLastRow, displayData.length)} من أصل{' '}
              {displayData.length} سجل
            </div>
            <div className='flex space-x-1'>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronsRight className='h-4 w-4' />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronRight className='h-4 w-4' />
              </button>

              {/* Page Numbers */}
              <div className='flex space-x-1'>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  let pageNum;

                  // Logic to display appropriate page numbers
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }

                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={index}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className='h-4 w-4' />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronsLeft className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Summary and Export */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6 mt-6'>
        <h3 className='text-lg font-medium text-gray-700 mb-4'>
          ملخص البيانات المحفوظة
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='border border-gray-200 rounded-md p-3'>
            <h4 className='font-medium text-gray-800 mb-2'>حالة التصويت</h4>
            <ul className='text-sm'>
              <li className='flex justify-between mb-1'>
                <span>صوت لنا:</span>
                <span className='font-medium'>{votingResults.ourTeam}</span>
              </li>
              <li className='flex justify-between mb-1'>
                <span>صوت للآخرين:</span>
                <span className='font-medium'>{votingResults.otherTeam}</span>
              </li>
              <li className='flex justify-between mb-1'>
                <span>لم يصوت:</span>
                <span className='font-medium'>{votingResults.notVoted}</span>
              </li>
              <li className='flex justify-between pt-1 border-t border-gray-200 mt-1'>
                <span>إجمالي:</span>
                <span className='font-medium'>{votingResults.total}</span>
              </li>
            </ul>
          </div>

          <div className='border border-gray-200 rounded-md p-3'>
            <h4 className='font-medium text-gray-800 mb-2'>
              البيانات المحفوظة
            </h4>
            <ul className='text-sm'>
              <li className='flex justify-between mb-1'>
                <span>بيانات الناخبين:</span>
                <span className='font-medium'>محفوظة في LocalStorage</span>
              </li>
              <li className='flex justify-between mb-1'>
                <span>حالة التصويت:</span>
                <span className='font-medium'>محفوظة في LocalStorage</span>
              </li>
              <li className='flex justify-between mb-1'>
                <span>نتائج التصويت:</span>
                <span className='font-medium'>محفوظة في LocalStorage</span>
              </li>
            </ul>
          </div>

          <div className='border border-gray-200 rounded-md p-3'>
            <h4 className='font-medium text-gray-800 mb-2'>إدارة البيانات</h4>
            <div className='flex flex-col space-y-2'>
              <button
                onClick={() => {
                  const data = {
                    categorizedData: JSON.parse(
                      localStorage.getItem('categorizedData') || '{}'
                    ),
                    votingResults: JSON.parse(
                      localStorage.getItem('votingResults') || '{}'
                    ),
                    votingStatusMap: JSON.parse(
                      localStorage.getItem('categorizedVotingData') || '{}'
                    ),
                  };

                  // Create a download link for the data
                  const dataStr = JSON.stringify(data);
                  const dataBlob = new Blob([dataStr], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `election_data_${
                    new Date().toISOString().split('T')[0]
                  }.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium'
              >
                تصدير البيانات
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه العملية.'
                    )
                  ) {
                    localStorage.removeItem('categorizedData');
                    localStorage.removeItem('votingResults');
                    localStorage.removeItem('categorizedVotingData');
                    window.location.reload();
                  }
                }}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium'
              >
                مسح البيانات
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-2 text-right'>
          معاينة هيكل JSON
        </h2>
        <pre className='bg-gray-100 p-4 rounded overflow-auto max-h-64 text-xs text-right'>
          {`{
  "لنا": [ /* ${data.لنا.length} سجل */ ],         // forUs (yellow)
  "لهم": [ /* ${data.لهم.length} سجل */ ],         // forThem (green)
  "حكومة": [ /* ${data.حكومة.length} سجل */ ],     // Goverment (orange)
  "أجانب": [ /* ${data.أجانب.length} سجل */ ],     // Foreginers (blue)
  "غير_معروف": [ /* ${data.غير_معروف.length} سجل */ ] // Unknown (white/none)
}`}
        </pre>
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
                هل أنت متأكد من تغيير حالة تصويت
              </p>
              <p className='text-center font-semibold text-gray-900 mb-2'>
                {confirmPerson?.name}
              </p>
              <p className='text-center text-gray-700 mb-1'>
                من:{' '}
                <span className='font-medium'>
                  {getVoteStatusText(confirmPerson?.voteStatus)}
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
}
