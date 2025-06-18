import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../contexts/auth.types';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching profile with token:', user.token);
        const response = await fetch('http://localhost:8888/shop/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Lỗi khi tải thông tin: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Profile API response:', data);
        if (data.status === 0 && data.data) {
          setProfileData(data.data as User);
          setEditData({
            name: data.data.name || '',
            email: data.data.email || '',
            gender: data.data.gender || '',
            birthDate: data.data.birthDate || '',
            avatar: null,
          });
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
  }, [user?.token]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Bạn cần đăng nhập để xem thông tin hồ sơ. <a href="/login">Đăng nhập</a></div>;

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
    waitingPayment: [
      {
        id: '12349',
        date: '17/06/2025',
        product: 'Chuột gaming',
        originalPrice: '500,000 đ',
        price: '450,000 đ',
        totalPrice: '450,000 đ',
        status: 'Chờ thanh toán',
        shop: '5TECH Store',
        image: '/path-to-mouse.jpg',
      },
    ],
    shipping: [
      {
        id: '12350',
        date: '16/06/2025',
        product: 'Màn hình LED',
        originalPrice: '5,000,000 đ',
        price: '4,500,000 đ',
        totalPrice: '4,500,000 đ',
        status: 'Đang vận chuyển',
        shop: '5TECH Store',
        image: '/path-to-monitor.jpg',
      },
    ],
    waitingDelivery: [
      {
        id: '12351',
        date: '17/06/2025',
        product: 'Ghế gaming',
        originalPrice: '3,000,000 đ',
        price: '2,700,000 đ',
        totalPrice: '2,700,000 đ',
        status: 'Chờ giao hàng',
        shop: '5TECH Store',
        image: '/path-to-chair.jpg',
      },
    ],
    completed: [],
    cancelled: [],
    returned: [],
  };

  const activePurchases: Purchase[] = purchases[activeTab as keyof Purchases] || [];

  const handleSave = () => {
    console.log('Saving:', editData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditData({ ...editData, avatar: e.target.files[0] });
    }
  };

  return (
    <div className="px-4 py-8 text-gray-800 bg-gray-100 min-h-screen flex flex-col">
      <div className="flex flex-1 mt-4">
        <div className="w-1/5 bg-white p-4 rounded-lg shadow mr-4">
          <div className="flex flex-col items-center mb-6">
            <img
              src={profileData?.avatar_url || user?.user?.avatar_url || '/path-to-avatar.jpg'}
              alt="Avatar"
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
            <span className="text-sm font-semibold text-gray-800 text-center">{profileData?.name || user?.user?.name || 'Người dùng'}</span>
          </div>
          <ul className="space-y-4 text-sm">
            <li>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-2 text-red-500 hover:text-red-700 ${activeTab === 'notifications' ? 'font-bold' : ''}`}
              >
                <span>🔔</span>
                <span>Thông Báo</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 ${activeTab === 'account' ? 'font-bold' : ''}`}
              >
                <span>👤</span>
                <span>Tài Khoản Của Tôi</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 ${activeTab === 'purchase' ? 'font-bold' : ''}`}
              >
                <span>📋</span>
                <span>Đơn Mua</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="w-11/12 bg-white p-4 rounded-lg shadow flex-1 flex flex-col">
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
              <p className="text-sm text-gray-500 mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tên đầy đủ</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <div className="flex space-x-4 mt-1">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={editData.gender === 'Nam'}
                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      /> Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={editData.gender === 'Nữ'}
                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      /> Nữ
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        checked={editData.gender === 'Khác'}
                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      /> Khác
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    value={editData.birthDate}
                    onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">Z</span>
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
                <button
                  onClick={handleSave}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Lưu
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
                          <button className="bg-orange-500 text-white px-2 py-1 rounded-full hover:bg-orange-600 text-sm">Mua lại</button>
                          <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm">Xem chi tiết</button>
                          <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm">Liên hệ người bán</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có đơn hàng nào.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}