import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from './ProfileSidebar';
import NotificationsTab from './NotificationsTab';
import AccountForm from './AccountForm';
import BankForm from './BankForm';
import AddressForm from './AddressForm';
import PasswordForm from './PasswordForm';
import PurchasesTab from './PurchasesTab';
import { ProfileUser, Purchase, Purchases, Notification } from '../Profile/types';

const API_URL = 'http://localhost:8888/shop/api/v1';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'account' | 'purchase' | 'waitingPayment' | 'shipping' | 'waitingDelivery' | 'completed' | 'cancelled' | 'returned' | 'bank' | 'address' | 'password'
  >('purchase');
  const [editData, setEditData] = useState<{
    name: string;
    email: string;
    gender: string;
    birthDate: string;
    address: string;
    avatar: File | null;
  }>({
    name: '',
    email: '',
    gender: '',
    birthDate: '',
    address: '',
    avatar: null,
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setError('Vui lòng đăng nhập để xem hồ sơ');
        setIsLoadingProfile(false);
        return;
      }
      try {
        setIsLoadingProfile(true);
        setError(null);
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Profile fetch error:', response.status, errorText);
          if (response.status === 401) {
            setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            return;
          }
          throw new Error(`Lỗi khi tải thông tin: ${errorText}`);
        }
        const data = await response.json();
        if (data.status === 0 && data.data) {
          const userData = data.data as ProfileUser;
          setProfileData(userData);
          setEditData({
            name: userData.name || '',
            email: userData.email || '',
            gender: userData.gender || '',
            birthDate: userData.birthDate || '',
            address: userData.address || '',
            avatar: null,
          });
          setUser({ ...user, user: userData });
        } else {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchBankProfile = async () => {
      if (!user?.token) return;
      try {
        setIsLoadingBank(true);
        setBankError(null);
        const response = await fetch(`${API_URL}/users/me/bank`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Bank profile fetch error:', response.status, errorText);
          if (response.status === 401) {
            setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            return;
          }
          throw new Error(`Lỗi khi tải thông tin ngân hàng: ${errorText}`);
        }
        const data = await response.json();
        if (data.status === 0 && data.data) {
          const bankInfo = data.data;
          setBankData({
            bankName: bankInfo.bankName || '',
            accountNumber: bankInfo.accountNumber || '',
            accountHolder: bankInfo.accountHolder || '',
          });
        } else {
          throw new Error('Dữ liệu ngân hàng không hợp lệ');
        }
      } catch (err) {
        setBankError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin ngân hàng');
        console.error('Bank profile fetch error:', err);
      } finally {
        setIsLoadingBank(false);
      }
    };

    fetchProfile();
    fetchBankProfile();

    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [user?.token, setUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1_000_000) {
        setError('File ảnh vượt quá 1MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Chỉ hỗ trợ định dạng .JPEG hoặc .PNG');
        return;
      }
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setEditData({ ...editData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
      if (editData.gender && !['Nam', 'Nữ', 'Khác'].includes(editData.gender)) {
        setError('Giới tính không hợp lệ');
        return;
      }
      if (editData.birthDate && new Date(editData.birthDate) > new Date()) {
        setError('Ngày sinh không được là tương lai');
        return;
      }

      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('gender', editData.gender);
      formData.append('birthDate', editData.birthDate);
      if (editData.avatar) formData.append('avatar', editData.avatar);

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile save error:', response.status, errorText);
        throw new Error(`Cập nhật hồ sơ thất bại: ${errorText}`);
      }

      const data = await response.json();
      if (data.status === 0 && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser({ ...user, user: updatedUser });
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
        }
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

      const response = await fetch(`${API_URL}/users/me/bank`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
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

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: editData.address }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Address save error:', response.status, errorText);
        throw new Error(`Cập nhật địa chỉ thất bại: ${errorText}`);
      }

      const data = await response.json();
      if (data.status === 0 && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser({ ...user, user: updatedUser });
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

      const response = await fetch(`${API_URL}/users/update-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: editData.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email update error:', response.status, errorText);
        throw new Error(`Cập nhật email thất bại: ${errorText}`);
      }

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

      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
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
    purchase: [
      {
        id: '12345',
        date: '16/06/2025',
        product: 'Bàn phím gaming',
        originalPrice: '4,999,999 đ',
        price: '115,500 đ',
        totalPrice: '115,500 đ',
        status: 'Đã giao',
        shop: '5TECH Store',
        image: '/path-to-gaming-keyboard.jpg',
      },
    ],
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
        avatarPreview={avatarPreview}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="w-4/5 p-8 bg-white rounded-lg shadow-md">
        {activeTab === 'notifications' && <NotificationsTab notifications={notifications} />}
        {activeTab === 'account' && (
          <AccountForm
            editData={editData}
            setEditData={setEditData}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
            profileData={profileData}
            error={error}
            isLoadingProfile={isLoadingProfile}
            isLoadingEmail={isLoadingEmail}
            handleSaveProfile={handleSaveProfile}
            handleSaveEmail={handleSaveEmail}
            handleFileChange={handleFileChange}
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