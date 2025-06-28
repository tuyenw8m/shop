import { type Purchases, type TabType } from './types';

interface PurchasesTabProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  purchases: Purchases;
}

export default function PurchasesTab({ activeTab, setActiveTab, purchases }: PurchasesTabProps) {
  const activePurchases = purchases[activeTab as keyof Purchases] || [];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đơn Mua</h2>
      <div className="flex flex-wrap gap-3 mb-6">
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
            onClick={() => setActiveTab(key as TabType)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === key
                ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-600 font-semibold'
                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
            aria-label={`Xem ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm đơn hàng..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          title="Chức năng tìm kiếm đang được phát triển"
          disabled
          aria-label="Tìm kiếm đơn hàng"
        />
      </div>
      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {activePurchases.length > 0 ? (
          activePurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={purchase.image}
                  alt={purchase.product}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm text-gray-500">{purchase.date}</p>
                  <p className="font-medium text-gray-800">{purchase.product}</p>
                  <p className="text-sm text-gray-500">Cửa hàng: {purchase.shop}</p>
                  <p className="text-sm text-gray-400 line-through">{purchase.originalPrice}</p>
                  <p className="text-lg font-bold text-red-500">{purchase.price}</p>
                  <p
                    className="text-sm"
                    style={{ color: purchase.status === 'Đã giao' ? '#00C73C' : '#F5A623' }}
                  >
                    {purchase.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm font-bold text-red-500">Thành tiền: {purchase.totalPrice}</p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-sm transition-colors duration-200"
                    aria-label={`Mua lại ${purchase.product}`}
                  >
                    Mua lại
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm transition-colors duration-200"
                    aria-label={`Xem chi tiết đơn hàng ${purchase.id}`}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm transition-colors duration-200"
                    aria-label={`Liên hệ cửa hàng ${purchase.shop}`}
                  >
                    Liên hệ người bán
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}