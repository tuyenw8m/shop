import { useState, useEffect, useRef } from 'react';
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
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
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

  const handleSaveProfile = async () => {
    if (!user?.token) {
      setError('Vui lòng đăng nhập để lưu hồ sơ');
      return;
    }
    try {
      setIsLoadingProfile(true);
      setError(null);

      if (!editData.name.trim()) {
        setError('Tên không được để trống');
        return;
      }

      const payload = {
        name: editData.name,
        address: editData.address,
        email: editData.email,
        phone: editData.phone,
      };

      console.log('Sending profile update with JSON:', payload);
      console.log('API URL:', `${API_URL}/user/me`);
      console.log('Request method: PUT');

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };
      console.log('Request headers:', headers);

      const response = await fetch(`${API_URL}/user/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile save error:', response.status, errorText);
        throw new Error(`Cập nhật hồ sơ thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile update response:', data);

      if (data.status === 0 && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
        alert('Cập nhật hồ sơ thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ');
      console.error('Profile save error:', err);
    } finally {
      setIsLoadingProfile(false);
    }
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
      console.log('Bank profile request headers:', headers);

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

  const handleSaveAddress = async () => {
    if (!user?.token) {
      setError('Vui lòng đăng nhập để lưu địa chỉ');
      return;
    }
    try {
      setIsLoadingProfile(true);
      setError(null);

      if (!editData.address.trim()) {
        setError('Địa chỉ không được để trống');
        return;
      }

      const payload = {
        address: editData.address,
      };

      console.log('Sending address update:', payload);

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };
      console.log('Address request headers:', headers);

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Address save error:', response.status, errorText);
        throw new Error(`Cập nhật địa chỉ thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Address update response:', data);

      if (data.status === 0 && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
        alert('Cập nhật địa chỉ thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật địa chỉ');
      console.error('Address save error:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!user?.token) {
      setError('Vui lòng đăng nhập để cập nhật email');
      return;
    }
    try {
      setIsLoadingEmail(true);
      setError(null);

      if (!editData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
        setError('Email không hợp lệ');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };
      console.log('Email request headers:', headers);
      console.log('Email update payload:', { email: editData.email });
      console.log('API URL:', `${API_URL}/users/me`);
      console.log('Request method: PUT');

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ email: editData.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email update error:', response.status, errorText);
        throw new Error(`Cập nhật email thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Email update response:', data);

      alert('Yêu cầu cập nhật email đã được gửi. Vui lòng kiểm tra hộp thư để xác minh.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật email');
      console.error('Email update error:', err);
    } finally {
      setIsLoadingEmail(false);
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
      console.log('Password change request headers:', headers);

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
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

  const isLoading = isLoadingProfile || isLoadingPassword || isLoadingEmail || isLoadingBank;

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
        <a href="/login" className="text-orange-500 hover:underline">Đăng nhập</a>
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
    <div className="flex h-screen bg-gray-100 font-sans">
      <ProfileSidebar
        profileData={profileData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="w-4/5 p-8 bg-white rounded-lg shadow-md">
        {activeTab === 'notifications' && <NotificationsTab notifications={notifications} />}
        {activeTab === 'account' && (
          <AccountForm
            editData={editData}
            setEditData={setEditData}
            error={error}
            isLoadingProfile={isLoadingProfile}
            isLoadingEmail={isLoadingEmail}
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
  );
}