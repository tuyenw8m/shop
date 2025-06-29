import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from './ProfileSidebar';
import NotificationsTab from './NotificationsTab';
import AccountForm from './AccountForm';
import BankForm from './BankForm';
import AddressForm from './AddressForm';
import PasswordForm from './PasswordForm';
import PurchasesTab from './PurchasesTab';
import { type ProfileUser, type Purchases, type Notification, type TabType } from './types';

const API_URL = 'http://localhost:8888/shop/api/v1';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('purchase');
  const [editData, setEditData] = useState<{
    name: string;
    email: string;
    address: string;
    phone: string;
  }>({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [bankData, setBankData] = useState<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });
  const [passwordData, setPasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.token || hasFetchedRef.current) {
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError(null);
        
        console.log('Attempting to fetch profile from:', `${API_URL}/users/me`);
        console.log('User token:', user.token ? 'Present' : 'Missing');
        
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response received:', response);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Profile fetch error:', response.status, errorText);
          if (response.status === 401) {
            setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            return;
          }
          if (response.status === 0) {
            setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            return;
          }
          throw new Error(`Lỗi khi tải thông tin: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Profile data received:', data);
        
        if (data.status === 0 && data.data) {
          const userData = data.data as ProfileUser;
          setProfileData(userData);
          setEditData({
            name: userData.name || '',
            email: userData.email || '',
            address: userData.address || '',
            phone: userData.phone || '',
          });
          setUser((prevUser) => ({ ...prevUser!, user: userData }));
        } else {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err) {
        console.error('Fetch error details:', err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('Không thể kết nối đến server. Vui lòng kiểm tra: 1) Backend có đang chạy không? 2) URL có đúng không? 3) CORS có được cấu hình không?');
        } else {
          setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchBankProfile = async () => {
      try {
        setIsLoadingBank(true);
        setBankError(null);
        setBankError('Endpoint ngân hàng không khả dụng. Vui lòng liên hệ admin.');
      } catch (err) {
        setBankError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin ngân hàng');
        console.error('Bank profile fetch error:', err);
      } finally {
        setIsLoadingBank(false);
      }
    };

    hasFetchedRef.current = true;
    fetchProfile();
    fetchBankProfile();
  }, [user?.token, setUser]);

  // Single debounced update function that always sends complete data
  const debouncedUpdateProfile = useCallback(async (successMessage: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(async () => {
      if (!user?.token) {
        setError('Vui lòng đăng nhập để lưu hồ sơ');
        return;
      }

      try {
        setIsLoadingProfile(true);
        setError(null);

        // Always send complete data to prevent backend conflicts
        const payload = {
          name: editData.name,
          address: editData.address,
          email: editData.email,
          phone: editData.phone,
        };

        console.log('=== PROFILE UPDATE DEBUG ===');
        console.log('Sending complete profile update:', payload);
        console.log('API URL:', `${API_URL}/users/me`);
        console.log('Trying different HTTP methods and endpoints...');

        const headers = {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        };

        // Try different endpoints and methods
        const endpoints = [
          { url: `${API_URL}/user/me`, method: 'PUT' },
          { url: `${API_URL}/users/me`, method: 'PUT' },
          { url: `${API_URL}/users/me`, method: 'PATCH' },
        ];

        let response = null;
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            console.log(`Trying ${endpoint.method} ${endpoint.url}...`);
            response = await fetch(endpoint.url, {
              method: endpoint.method,
              headers,
              body: JSON.stringify(payload),
            });
            
            console.log(`${endpoint.method} ${endpoint.url} Response status:`, response.status);
            
            if (response.ok) {
              console.log(`Success with ${endpoint.method} ${endpoint.url}`);
              break;
            } else if (response.status !== 405) {
              // If it's not 405, it might be a different error (400, 401, etc.)
              lastError = `Status ${response.status}: ${await response.text()}`;
              break;
            }
          } catch (err) {
            console.log(`Error with ${endpoint.method} ${endpoint.url}:`, err);
            lastError = err;
          }
        }

        if (!response || !response.ok) {
          const errorText = lastError || await response?.text() || 'Unknown error';
          console.error('All profile update methods failed:', errorText);
          throw new Error(`Cập nhật hồ sơ thất bại: ${errorText}`);
        }

        const data = await response.json();
        console.log('Profile update response:', data);

        if ((data.status === 0 || data.status === "success") && data.data) {
          const updatedUser = data.data as ProfileUser;
          setProfileData(updatedUser);
          setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
          alert(successMessage);
        } else {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
      } catch (err) {
        console.error('Profile save error details:', err);
        setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ');
      } finally {
        setIsLoadingProfile(false);
      }
    }, 300); // 300ms debounce
  }, [user?.token, setUser, editData]);

  // Single function for all profile updates
  const handleSaveProfile = async () => {
    if (!editData.name.trim()) {
      setError('Tên không được để trống');
      return;
    }
    await debouncedUpdateProfile('Cập nhật hồ sơ thành công!');
  };

  // Remove separate address update function - use the main one
  const handleSaveAddress = async () => {
    if (!editData.address.trim()) {
      setError('Địa chỉ không được để trống');
      return;
    }
    await debouncedUpdateProfile('Cập nhật địa chỉ thành công!');
  };

  const handleSaveBankProfile = async () => {
    if (!user?.token) {
      setBankError('Vui lòng đăng nhập để lưu hồ sơ ngân hàng');
      return;
    }
    try {
      setIsLoadingBank(true);
      setBankError(null);

      if (!bankData.bankName.trim()) {
        setBankError('Tên ngân hàng không được để trống');
        return;
      }
      if (!bankData.accountNumber.trim()) {
        setBankError('Số tài khoản không được để trống');
        return;
      }
      if (!bankData.accountHolder.trim()) {
        setBankError('Tên chủ tài khoản không được để trống');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_URL}/users/me/bank`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          bankName: bankData.bankName,
          accountNumber: bankData.accountNumber,
          accountHolder: bankData.accountHolder,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bank profile save error:', response.status, errorText);
        throw new Error(`Cập nhật hồ sơ ngân hàng thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Bank profile update response:', data);

      if (data.status === 0 && data.data) {
        setBankData({
          bankName: data.data.bankName || '',
          accountNumber: data.data.accountNumber || '',
          accountHolder: data.data.accountHolder || '',
        });
        alert('Cập nhật hồ sơ ngân hàng thành công!');
      } else {
        throw new Error('Dữ liệu ngân hàng không hợp lệ');
      }
    } catch (err) {
      setBankError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ ngân hàng');
      console.error('Bank profile save error:', err);
    } finally {
      setIsLoadingBank(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.token) {
      setPasswordError('Vui lòng đăng nhập để đổi mật khẩu');
      return;
    }
    try {
      setIsLoadingPassword(true);
      setPasswordError(null);

      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('Vui lòng điền đầy đủ các trường mật khẩu');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Mật khẩu xác nhận không khớp');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_URL}/changepassword`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Password change error:', response.status, errorText);
        throw new Error(`Đổi mật khẩu thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Password change response:', data);

      if (data.status === 0) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Đổi mật khẩu thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu');
      console.error('Password change error:', err);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // Check if there's a specific endpoint for email updates
  const handleSaveEmail = async () => {
    if (!user?.token) {
      setError('Vui lòng đăng nhập để cập nhật email');
      return;
    }

    try {
      setIsLoadingProfile(true);
      setError(null);

      if (!editData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
        setError('Email không hợp lệ');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      console.log('=== EMAIL UPDATE DEBUG ===');
      console.log('Email to update:', editData.email);

      // Try different email update endpoints
      const emailEndpoints = [
        { url: `${API_URL}/user/me`, method: 'PUT' },
        { url: `${API_URL}/users/me`, method: 'PUT' },
        { url: `${API_URL}/users/me`, method: 'PATCH' },
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of emailEndpoints) {
        try {
          console.log(`Trying email update: ${endpoint.method} ${endpoint.url}...`);
          response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers,
            body: JSON.stringify({ email: editData.email }),
          });
          
          console.log(`${endpoint.method} ${endpoint.url} Response status:`, response.status);
          
          if (response.ok) {
            console.log(`Email update success with ${endpoint.method} ${endpoint.url}`);
            break;
          } else if (response.status !== 405) {
            lastError = `Status ${response.status}: ${await response.text()}`;
            break;
          }
        } catch (err) {
          console.log(`Error with ${endpoint.method} ${endpoint.url}:`, err);
          lastError = err;
        }
      }

      if (!response || !response.ok) {
        const errorText = lastError || await response?.text() || 'Unknown error';
        console.error('All email update methods failed:', errorText);
        throw new Error(`Cập nhật email thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Email update response:', data);

      if ((data.status === 0 || data.status === "success") && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
        alert('Cập nhật email thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      console.error('Email update error details:', err);
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật email');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const isLoading = isLoadingProfile || isLoadingPassword || isLoadingBank;

  if (isLoading && !profileData) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-lg text-gray-600">Đang tải...</div>
    </div>
  );
  if (error && !profileData) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );
  if (!user || !profileData) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-lg text-gray-600">
        Bạn cần đăng nhập để xem thông tin hồ sơ.{' '}
        <a href="/login" className="text-green-500 hover:underline">Đăng nhập</a>
      </div>
    </div>
  );

  const notifications: Notification[] = [
    { id: 1, message: 'Bạn có đơn hàng mới vào 03:00 PM, 17/06/2025', read: false },
    { id: 2, message: 'Đơn hàng #12345 đã được giao', read: true },
  ];

  const purchases: Purchases = {
    purchase: [],
    waitingPayment: [],
    shipping: [],
    waitingDelivery: [],
    completed: [],
    cancelled: [],
    returned: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfileSidebar
          profileData={profileData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'notifications' && <NotificationsTab notifications={notifications} />}
            {activeTab === 'account' && (
              <AccountForm
                editData={editData}
                setEditData={setEditData}
                error={error}
                isLoadingProfile={isLoadingProfile}
                handleSaveProfile={handleSaveProfile}
                handleSaveEmail={handleSaveEmail}
              />
            )}
            {activeTab === 'bank' && (
              <BankForm
                bankData={bankData}
                setBankData={setBankData}
                bankError={bankError}
                isLoadingBank={isLoadingBank}
                handleSaveBankProfile={handleSaveBankProfile}
              />
            )}
            {activeTab === 'address' && (
              <AddressForm
                editData={editData}
                setEditData={setEditData}
                error={error}
                isLoadingProfile={isLoadingProfile}
                handleSaveAddress={handleSaveAddress}
              />
            )}
            {activeTab === 'password' && (
              <PasswordForm
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                passwordError={passwordError}
                isLoadingPassword={isLoadingPassword}
                handleChangePassword={handleChangePassword}
              />
            )}
            {['purchase', 'waitingPayment', 'shipping', 'waitingDelivery', 'completed', 'cancelled', 'returned'].includes(activeTab) && (
              <PurchasesTab
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                purchases={purchases}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}