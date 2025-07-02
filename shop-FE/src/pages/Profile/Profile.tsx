import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from './ProfileSidebar';
import NotificationsTab from './NotificationsTab';
import AccountForm from './AccountForm';
import BankForm from './BankForm';
import AddressForm from './AddressForm';
import PasswordForm from './PasswordForm';
import PurchasesTab from './PurchasesTab';
import { type ProfileUser, type Purchases, type Notification, type TabType, type OrderResponse } from './types';
import { saveProfileToLocalStorage } from 'src/utils/utils';
import { useOrderContext } from '../contexts/OrderContext';

const API_URL = 'http://localhost:8888/shop/api/v1';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { refreshTrigger } = useOrderContext();
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('purchase');
  const [editData, setEditData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: '',
    email: '',
    phone: '',
  });
  const [address, setAddress] = useState<string>('');
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
  const [purchases, setPurchases] = useState<Purchases>({
    purchase: [],
    waitingPayment: [],
    shipping: [],
    waitingDelivery: [],
    completed: [],
    cancelled: [],
    returned: [],
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token || hasFetchedRef.current) {
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError(null);

        console.log('Đang cố gắng tải hồ sơ từ:', `${API_URL}/users/me`);
        console.log('Token người dùng:', user.token ? 'Có' : 'Thiếu');

        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Đã nhận phản hồi:', response);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Lỗi tải hồ sơ:', response.status, errorText);
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
        console.log('Dữ liệu hồ sơ đã nhận:', data);

        if (data.status === 0 && data.data) {
          const userData = data.data as ProfileUser;
          setProfileData(userData);
          setEditData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
          });
          setAddress(userData.address || '');
          setUser((prevUser) => ({ ...prevUser!, user: userData }));
          saveProfileToLocalStorage(userData);
        } else {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err) {
        console.error('Chi tiết lỗi tải dữ liệu:', err);
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
        setBankError('Tính năng đang được phát triển !');
      } catch (err) {
        setBankError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin ngân hàng');
        console.error('Lỗi tải hồ sơ ngân hàng:', err);
      } finally {
        setIsLoadingBank(false);
      }
    };

    hasFetchedRef.current = true;
    fetchProfile();
    fetchBankProfile();
  }, [user?.token, setUser]);

  // Function to fetch orders that can be called from outside
  const fetchOrders = useCallback(async () => {
    if (!user?.token) return;
    try {
      console.log('🔄 Fetching orders...');
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      console.log('📦 Orders API response:', data);
      
      if ((data.status === 'success' || data.status === 0) && data.data?.content) {
        const allOrders: OrderResponse[] = data.data.content;
        console.log('📋 Parsed orders:', allOrders);
        
        // Fetch product details for each order
        const ordersWithProducts = await Promise.all(
          allOrders.map(async (order) => {
            try {
              const productRes = await fetch(`${API_URL}/products/${order.product_id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
              });
              const productData = await productRes.json();
              return {
                ...order,
                product: productData.data || null
              };
            } catch (error) {
              console.error(`Error fetching product ${order.product_id}:`, error);
              return {
                ...order,
                product: null
              };
            }
          })
        );
        
        setPurchases({
          purchase: ordersWithProducts,
          waitingPayment: ordersWithProducts.filter(o => o.status === 'PENDING'),
          shipping: ordersWithProducts.filter(o => o.status === 'SHIPPED'),
          waitingDelivery: ordersWithProducts.filter(o => o.status === 'CONFIRMED'),
          completed: ordersWithProducts.filter(o => o.status === 'DELIVERED'),
          cancelled: ordersWithProducts.filter(o => o.status === 'CANCELLED'),
          returned: [],
        });
        console.log('✅ Orders updated in state');
      } else {
        console.log('❌ Invalid orders response structure:', data);
      }
    } catch (error) {
      console.error('❌ Lỗi tải đơn hàng:', error);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) return;
    fetchOrders();
  }, [user?.token, refreshTrigger, fetchOrders]);

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
          email: editData.email,
          phone: editData.phone,
        };

        console.log('=== GỠ LỖI CẬP NHẬT HỒ SƠ ===');
        console.log('Gửi cập nhật hồ sơ hoàn chỉnh:', payload);
        console.log('URL API:', `${API_URL}/users/me`);
        console.log('Thử các phương thức HTTP và endpoint khác nhau...');

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
            console.log(`Thử ${endpoint.method} ${endpoint.url}...`);
            response = await fetch(endpoint.url, {
              method: endpoint.method,
              headers,
              body: JSON.stringify(payload),
            });

            console.log(`${endpoint.method} ${endpoint.url} Trạng thái phản hồi:`, response.status);

            if (response.ok) {
              console.log(`Thành công với ${endpoint.method} ${endpoint.url}`);
              break;
            } else if (response.status !== 405) {
              // If it's not 405, it might be a different error (400, 401, etc.)
              lastError = `Trạng thái ${response.status}: ${await response.text()}`;
              break;
            }
          } catch (err) {
            console.log(`Lỗi với ${endpoint.method} ${endpoint.url}:`, err);
            lastError = err;
          }
        }

        if (!response || !response.ok) {
          const errorText = lastError || await response?.text() || 'Lỗi không xác định';
          console.error('Tất cả các phương thức cập nhật hồ sơ đều thất bại:', errorText);
          throw new Error(`Cập nhật hồ sơ thất bại: ${errorText}`);
        }

        const data = await response.json();
        console.log('Phản hồi cập nhật hồ sơ:', data);

        if ((data.status === 0 || data.status === "success") && data.data) {
          const updatedUser = data.data as ProfileUser;
          setProfileData(updatedUser);
          setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
          saveProfileToLocalStorage(updatedUser);
          setSuccessMessage(successMessage);
        } else {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
      } catch (err) {
        console.error('Chi tiết lỗi lưu hồ sơ:', err);
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

  const handleSaveAddress = async () => {
    if (!address.trim()) {
      setError('Địa chỉ không được để trống');
      return;
    }
    
    if (!user?.token) {
      setError('Vui lòng đăng nhập để lưu địa chỉ');
      return;
    }

    try {
      setIsLoadingProfile(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_URL}/user/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ address: address }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật địa chỉ thất bại: ${errorText}`);
      }

      const data = await response.json();
      if (data.status === 0 && data.data) {
        const updatedUser = data.data as ProfileUser;
        setProfileData(updatedUser);
        setUser((prevUser) => ({ ...prevUser!, user: updatedUser }));
        saveProfileToLocalStorage(updatedUser);
        setSuccessMessage('Cập nhật địa chỉ thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật địa chỉ');
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
        console.error('Lỗi lưu hồ sơ ngân hàng:', response.status, errorText);
        throw new Error(`Cập nhật hồ sơ ngân hàng thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Phản hồi cập nhật hồ sơ ngân hàng:', data);

      if (data.status === 0 && data.data) {
        setBankData({
          bankName: data.data.bankName || '',
          accountNumber: data.data.accountNumber || '',
          accountHolder: data.data.accountHolder || '',
        });
        saveProfileToLocalStorage(data.data as ProfileUser);
        setSuccessMessage('Cập nhật hồ sơ ngân hàng thành công!');
      } else {
        throw new Error('Dữ liệu ngân hàng không hợp lệ');
      }
    } catch (err) {
      setBankError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ ngân hàng');
      console.error('Lỗi lưu hồ sơ ngân hàng:', err);
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
        console.error('Lỗi đổi mật khẩu:', response.status, errorText);
        throw new Error(`Đổi mật khẩu thất bại: ${errorText}`);
      }

      const data = await response.json();
      console.log('Phản hồi đổi mật khẩu:', data);

      if (data.status === 0) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        saveProfileToLocalStorage(data.data as ProfileUser);
        setSuccessMessage('Đổi mật khẩu thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu');
      console.error('Lỗi đổi mật khẩu:', err);
    } finally {
      setIsLoadingPassword(false);
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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <ProfileSidebar
          profileData={profileData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'notifications' && <NotificationsTab notifications={notifications} />}
            {activeTab === 'account' && (
              <AccountForm
                editData={editData}
                setEditData={setEditData}
                error={error}
                isLoadingProfile={isLoadingProfile}
                handleSaveProfile={handleSaveProfile}
                successMessage={successMessage}
              />
            )}
            {activeTab === 'bank' && (
              <BankForm
                bankData={bankData}
                setBankData={setBankData}
                bankError={bankError}
                isLoadingBank={isLoadingBank}
                handleSaveBankProfile={handleSaveBankProfile}
                successMessage={successMessage}
              />
            )}
            {activeTab === 'address' && (
              <AddressForm
                address={address}
                setAddress={setAddress}
                error={error}
                isLoadingProfile={isLoadingProfile}
                handleSaveAddress={handleSaveAddress}
                successMessage={successMessage}
              />
            )}
            {activeTab === 'password' && (
              <PasswordForm
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                passwordError={passwordError}
                isLoadingPassword={isLoadingPassword}
                handleChangePassword={handleChangePassword}
                successMessage={successMessage}
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