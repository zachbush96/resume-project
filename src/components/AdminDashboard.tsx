import React from 'react';
import { 
  BrainCog, 
  Users, 
  FileText, 
  BadgeDollarSign, 
  BarChart3, 
  Search,
  Filter,
  MoreVertical,
  //ArrowUpDown
} from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  joinDate: string;
  applications: number;
  lastActive: string;
}

interface ApplicationData {
  id: string;
  userId: string;
  userName: string;
  companyName: string;
  jobTitle: string;
  status: 'Generated' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'users' | 'applications'>('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [users, setUsers] = React.useState<User[]>([]);
  const [applications, setApplications] = React.useState<ApplicationData[]>([]);
  const [user, loadingAuth] = useAuthState(auth);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList: User[] = userSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        isPremium: doc.data().isPremium,
        joinDate: doc.data().joinDate,
        applications: doc.data().applications || 0,
        lastActive: doc.data().lastActive,
      }));
      setUsers(userList);
    };

    const fetchApplications = async () => {
      const db = getFirestore();
      const appsCol = collection(db, 'applications');
      const appSnapshot = await getDocs(appsCol);
      const appList: ApplicationData[] = appSnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        userName: doc.data().userName,
        companyName: doc.data().companyName,
        jobTitle: doc.data().jobTitle,
        status: doc.data().status,
        createdAt: doc.data().createdAt,
      }));
      setApplications(appList);
    };

    if (user) {
      fetchUsers();
      fetchApplications();
    }
  }, [user]);

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Job Getter AI Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin User</span>
            <img
              src={user?.photoURL || '/api/placeholder/32/32'}
              alt="Admin"
              className="w-8 h-8 rounded-full bg-gray-200"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Total Users"
            value={users.length.toString()}
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            icon={<BadgeDollarSign className="h-6 w-6 text-green-600" />}
            title="Premium Users"
            value={users.filter(u => u.isPremium).length.toString()}
            trend="+8%"
            trendUp={true}
          />
          <StatCard
            icon={<FileText className="h-6 w-6 text-purple-600" />}
            title="Applications"
            value={applications.length.toString()}
            trend="+15%"
            trendUp={true}
          />
          <StatCard
            icon={<BarChart3 className="h-6 w-6 text-orange-600" />}
            title="Success Rate"
            value="67%"
            trend="+5%"
            trendUp={true}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </TabButton>
          <TabButton 
            active={activeTab === 'applications'} 
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </TabButton>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users, applications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'users' && <UsersTable users={users} searchTerm={searchTerm} />}
          {activeTab === 'applications' && <ApplicationsTable applications={applications} searchTerm={searchTerm} />}
          {activeTab === 'overview' && <DashboardOverview />}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
    </div>
    <div className={`mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
      {trend} from last month
    </div>
  </div>
);

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium text-sm border-b-2 ${
      active
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface UsersTableProps {
  users: User[];
  searchTerm: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, searchTerm }) => {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Join Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Active
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={user.id ? `/api/placeholder/${user.id}` : '/api/placeholder/40/40'}
                    alt=""
                    className="h-10 w-10 rounded-full bg-gray-200"
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.isPremium
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isPremium ? 'Premium' : 'Free'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.joinDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.applications}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastActive}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ApplicationsTableProps {
  applications: ApplicationData[];
  searchTerm: string;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ applications, searchTerm }) => {
  const filteredApps = applications.filter(app =>
    app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Application Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredApps.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{app.companyName}</div>
                  <div className="text-sm text-gray-500">{app.jobTitle}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{app.userName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {app.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ApplicationData['status'] }> = ({ status }) => {
  const colors = {
    Generated: 'bg-blue-100 text-blue-800',
    Applied: 'bg-yellow-100 text-yellow-800',
    Interview: 'bg-purple-100 text-purple-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
};

const DashboardOverview: React.FC = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Add charts and graphs here */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">User Growth</h3>
        {/* Add user growth chart */}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Application Success Rate</h3>
        {/* Add success rate chart */}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Premium Conversions</h3>
        {/* Add premium conversion chart */}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Popular Job Categories</h3>
        {/* Add job categories chart */}
      </div>
    </div>
  </div>
);

export default AdminDashboard;