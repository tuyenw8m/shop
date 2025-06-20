import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/auth.types';

const API_URL = 'http://localhost:8888/shop/api/v1';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
const [isLoadingPassword, setIsLoadingPassword] = useState(false);
const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'account' | 'purchase' | 'waitingPayment' | 'shipping' | 'waitingDelivery' | 'completed' | 'cancelled' | 'returned'
  >('purchase');
  const [editData, setEditData] = useState<{
    name: string;
    email: string;
    gender: string;
    birthDate: string;
    avatar: File | null;
  }>({
    name: '',
    email: '',
    gender: '',
    birthDate: '',
    avatar: null,
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  interface Purchase {
    id: string;
    date: string;
    product: string;
    originalPrice: string;
    price: string;
    totalPrice: string;
    status: string;
    shop: string;
    image: string;
  }

  type Purchases = {
    [key in 'purchase' | 'waitingPayment' | 'shipping' | 'waitingDelivery' | 'completed' | 'cancelled' | 'returned']: Purchase[];
  };

  
  // Mask email for display
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name[0]}***@${domain}`;
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setError('Vui lòng đăng nhập để xem hồ sơ');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          if (response.status === 401) throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          throw new Error(`Lỗi khi tải thông tin: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status === 0 && data.data) {
          const userData = data.data as User;
          setProfileData(userData);
          setEditData({
            name: userData.name || '',
            email: userData.email || '',
            gender: userData.gender || '',
            birthDate: userData.birthDate || '',
            avatar: null,
          });
          setUser({ ...user, user: userData }); // Update auth context
        } else {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, setUser]);

  // Handle avatar file change
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
      setEditData({ ...editData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
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
      if (!response.ok) throw new Error('Cập nhật hồ sơ thất bại');
      const data = await response.json();
      if (data.status === 0 && data.data) {
        const updatedUser = data.data as User;
        setProfileData(updatedUser);
        setUser({ ...user, user: updatedUser });
        setAvatarPreview(null); // Clear preview after save
        alert('Cập nhật hồ sơ thành công!');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  // Handle email update (requires backend verification)
  const handleSaveEmail = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
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
      if (!response.ok) throw new Error('Cập nhật email thất bại');
      alert('Yêu cầu cập nhật email đã được gửi. Vui lòng kiểm tra hộp thư để xác minh.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật email');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setPasswordError(null);

      // Validate passwords
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
      if (!response.ok) throw new Error('Đổi mật khẩu thất bại');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Đổi mật khẩu thành công!');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) return <div className="text-center py-8">Đang tải...</div>;
  if (error && !profileData) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user || !profileData) return (
    <div className="text-center py-8">
      Bạn cần đăng nhập để xem thông tin hồ sơ. <a href="/login" className="text-blue-500 hover:underline">Đăng nhập</a>
    </div>
  );

  // Hardcoded data (replace with API calls in production)
  const notifications = [
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

  const activePurchases: Purchase[] = purchases[activeTab as keyof Purchases] || [];

  return (
    <div className="px-4 py-8 text-gray-800 bg-gray-100 min-h-screen flex flex-col font-sans">
      <div className="flex flex-1 mt-4 gap-4">
        <div className="w-full md:w-1/5 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarPreview || profileData.avatar_url || '/path-to-avatar.jpg'}
              alt="Avatar"
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
            <span className="text-sm font-semibold text-gray-800 text-center">{profileData.name || 'Người dùng'}</span>
            <span className="text-xs text-gray-500">{maskEmail(profileData.email)}</span>
          </div>
          <ul className="space-y-4 text-sm">
            <li>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-2 w-full text-left text-red-500 hover:text-red-700 ${activeTab === 'notifications' ? 'font-bold' : ''}`}
                aria-label="Xem thông báo"
              >
                <span>🔔</span>
                <span>Thông Báo</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'account' ? 'font-bold' : ''}`}
                aria-label="Quản lý tài khoản"
              >
                <span>👤</span>
                <span>Tài Khoản Của Tôi</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'purchase' ? 'font-bold' : ''}`}
                aria-label="Xem đơn mua"
              >
                <span>📋</span>
                <span>Đơn Mua</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-4/5 bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông Báo</h2>
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notif) => (
                    <li key={notif.id} className={notif.read ? 'text-gray-500' : 'text-black font-medium'}>
                      {notif.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có thông báo nào.</p>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4">Hồ Sơ Của Tôi</h2>
              <p className="text-sm text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

              {error && <div className="text-red-500 mb-4">{error}</div>}

              {/* Profile Information */}
              <div className="mb-8">
                <h3 className="text-md font-medium mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên đầy đủ</label>
                    <input
                      id="name"
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      aria-describedby="name-help"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 flex">
                      <input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="block w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
                        aria-describedby="email-help"
                      />
                      <button
                        onClick={handleSaveEmail}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={loading}
                        aria-label="Cập nhật email"
                      >
                        Cập nhật
                      </button>
                    </div>
                    <p id="email-help" className="text-xs text-gray-500 mt-1">Cập nhật email yêu cầu xác minh qua hộp thư.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <div className="flex space-x-4 mt-1">
                      {['Nam', 'Nữ', 'Khác'].map((gender) => (
                        <label key={gender} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={editData.gender === gender}
                            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                            className="mr-1"
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input
                      id="birthDate"
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="avatarUpload" className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {avatarPreview || profileData.avatar_url ? (
                          <img
                            src={avatarPreview || profileData.avatar_url}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">{profileData.name[0]?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                          id="avatarUpload"
                        />
                        <label
                          htmlFor="avatarUpload"
                          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                        >
                          Chọn Ảnh
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Dung lượng file tối đa 1MB<br />Định dạng: .JPEG, .PNG</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                  disabled={loading}
                  aria-label="Lưu thông tin hồ sơ"
                >
                  {loading ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
                </button>
              </div>

              {/* Change Password */}
              <div>
                <h3 className="text-md font-medium mb-4">Đổi Mật Khẩu</h3>
                {passwordError && <div className="text-red-500 mb-4">{passwordError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                  disabled={loading}
                  aria-label="Đổi mật khẩu"
                >
                  {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                </button>
              </div>
            </div>
          )}

          {['purchase', 'waitingPayment', 'shipping', 'waitingDelivery', 'completed', 'cancelled', 'returned'].includes(activeTab) && (
            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: 'Tất cả', key: 'purchase' },
                  { label: 'Chờ thanh toán', key: 'waitingPayment' },
                  { label: 'Vận chuyển', key: 'shipping' },
                  { label: 'Chờ giao hàng', key: 'waitingDelivery' },
                  { label: 'Hoàn thành', key: 'completed' },
                  { label: 'Đã huỷ', key: 'cancelled' },
                  { label: 'Trả hàng / Hoàn tiền', key: 'returned' },
                ].map(({ label, key }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as keyof Purchases)}
                    className={`px-4 py-2 rounded transition-all duration-300 ${
                      activeTab === key
                        ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-100'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    aria-label={`Xem ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tìm đơn hàng..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled
                  aria-label="Tìm kiếm đơn hàng"
                />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
                {activePurchases.length > 0 ? (
                  activePurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="border-b border-gray-200 py-3 flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl rounded-lg px-2 bg-white hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={purchase.image} alt={purchase.product} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="text-xs text-gray-500">{purchase.date}</p>
                          <p className="font-medium text-gray-800">{purchase.product}</p>
                          <p className="text-xs text-gray-500">Cửa hàng: {purchase.shop}</p>
                          <p className="text-xs text-gray-400 line-through">{purchase.originalPrice}</p>
                          <p className="text-lg text-red-500 font-bold">{purchase.price}</p>
                          <p className="text-sm mt-1" style={{ color: purchase.status === 'Đã giao' ? '#00C73C' : '#F5A623' }}>
                            {purchase.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="text-sm text-red-500 font-bold">Thành tiền: {purchase.totalPrice}</p>
                        <div className="space-x-2">
                          <button className="bg-orange-500 text-white px-2 py-1 rounded-full hover:bg-orange-600 text-sm" aria-label={`Mua lại ${purchase.product}`}>
                            Mua lại
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm" aria-label={`Xem chi tiết đơn hàng ${purchase.id}`}>
                            Xem chi tiết
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm" aria-label={`Liên hệ cửa hàng ${purchase.shop}`}>
                            Liên hệ người bán
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}