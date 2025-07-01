import { useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ShoppingCart, Eye, MessageCircle, RefreshCw } from 'lucide-react';
import { formatPrices } from 'src/utils/utils';
import { useCartMutations } from 'src/hooks/useCartMutations';
import { useCartQuery } from 'src/hooks/useCartQuery';
import { getProfileLocalStorage } from 'src/utils/utils';
import type { RootState } from 'src/app/store';
import { type Purchases, type TabType } from './types';

interface PurchasesTabProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  purchases: Purchases;
}

export default function PurchasesTab({ activeTab, setActiveTab, purchases }: PurchasesTabProps) {
  const userProfile = getProfileLocalStorage();
  const user_id = userProfile?.id;

  useCartQuery(user_id);

  const { items } = useSelector((state: RootState) => state.cart);
  const { updateCartItemQuantity, removeCartItem } = useCartMutations(user_id);

  const handleRemoveFromCart = (itemId: string) => {
    if (user_id) {
      removeCartItem.mutate(itemId);
    }
  };

  const handleUpdateQuantityChange = (itemId: string, productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    if (user_id) {
      updateCartItemQuantity.mutate({ item_id: itemId, product_id: productId, quantity: newQuantity });
    }
  };

  // Kết hợp dữ liệu đơn hàng và giỏ hàng cho tab "Tất cả"
  const getActiveItems = () => {
    if (activeTab === 'purchase') {
      // Hiển thị sản phẩm từ giỏ hàng
      return items.map((item) => ({
        id: item.item_id,
        date: new Date().toLocaleDateString('vi-VN'),
        product: item.name,
        originalPrice: formatPrices(item.price),
        price: formatPrices(item.price),
        totalPrice: formatPrices(item.price * item.quantity),
        status: 'Trong giỏ hàng',
        shop: '5TECH Store',
        image: item.image_url,
        quantity: item.quantity,
        isCartItem: true,
        item_id: item.item_id,
        product_id: item.product_id
      }));
    }
    return purchases[activeTab as keyof Purchases] || [];
  };

  const activeItems = getActiveItems();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đơn Mua</h2>
        <p className="text-gray-600">Quản lý đơn hàng và giỏ hàng của bạn</p>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Tất cả', key: 'purchase', icon: ShoppingCart },
            { label: 'Chờ thanh toán', key: 'waitingPayment', icon: RefreshCw },
            { label: 'Vận chuyển', key: 'shipping', icon: RefreshCw },
            { label: 'Chờ giao hàng', key: 'waitingDelivery', icon: RefreshCw },
            { label: 'Hoàn thành', key: 'completed', icon: RefreshCw },
            { label: 'Đã huỷ', key: 'cancelled', icon: RefreshCw },
            { label: 'Trả hàng / Hoàn tiền', key: 'returned', icon: RefreshCw },
          ].map(({ label, key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600 hover:shadow-md'
              }`}
              aria-label={`Xem ${label}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
              {activeTab === 'purchase' && key === 'purchase' && items.length > 0 && (
                <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                  {items.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder=" Tìm đơn hàng hoặc sản phẩm..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            title="Chức năng tìm kiếm đang được phát triển"
            disabled
            aria-label="Tìm kiếm đơn hàng"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6">
        <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {activeItems.length > 0 ? (
            activeItems.map((item) => {
              const cartItem = item as unknown as {
                id: string;
                date: string;
                product: string;
                originalPrice: string;
                price: string;
                totalPrice: string;
                status: string;
                shop: string;
                image: string;
                quantity: number;
                isCartItem: boolean;
                item_id: string;
                product_id: string;
                address?: string;
                phone?: string;
              };
              return (
              <div
                key={cartItem.id}
                className="group bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Product Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <img
                          src={cartItem.image}
                          alt={cartItem.product}
                          className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        {cartItem.isCartItem && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🛒
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {cartItem.date}
                          </p>
                          {cartItem.isCartItem && (
                            <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                              Trong giỏ hàng
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {cartItem.product}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">🏪 {cartItem.shop}</p>
                        
                        {/* Price Display */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg font-bold text-red-600">{cartItem.price}</span>
                          {cartItem.originalPrice !== cartItem.price && (
                            <span className="text-sm text-gray-400 line-through">{cartItem.originalPrice}</span>
                          )}
                        </div>

                        {/* Quantity Controls for Cart Items */}
                        {cartItem.isCartItem && (
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg bg-white">
                              <button
                                onClick={() => handleUpdateQuantityChange(cartItem.item_id, cartItem.product_id, cartItem.quantity - 1)}
                                disabled={cartItem.quantity <= 1}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium text-base">{cartItem.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantityChange(cartItem.item_id, cartItem.product_id, cartItem.quantity + 1)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        <p
                          className="text-sm font-medium inline-flex items-center gap-1 px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: cartItem.status === 'Đã giao' ? '#dcfce7' : '#fef3c7',
                            color: cartItem.status === 'Đã giao' ? '#166534' : '#92400e'
                          }}
                        >
                          {cartItem.status}
                        </p>

                        {!cartItem.isCartItem && cartItem.address && (
                          <p className="text-sm text-gray-500 mb-1">Địa chỉ nhận: {cartItem.address}</p>
                        )}
                        {!cartItem.isCartItem && cartItem.phone && (
                          <p className="text-sm text-gray-500 mb-1">SĐT: {cartItem.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3 ml-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Thành tiền:</p>
                        <p className="text-xl font-bold text-red-600">{cartItem.totalPrice}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {cartItem.isCartItem ? (
                          // Cart item actions
                          <>
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              aria-label={`Mua ngay ${cartItem.product}`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Mua ngay
                            </button>
                            <button
                              onClick={() => handleRemoveFromCart(cartItem.item_id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 text-sm font-medium transition-all duration-200"
                              aria-label={`Xóa ${cartItem.product} khỏi giỏ hàng`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </>
                        ) : (
                          // Purchase item actions
                          <>
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              aria-label={`Mua lại ${cartItem.product}`}
                            >
                              <RefreshCw className="w-4 h-4" />
                              Mua lại
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium transition-all duration-200"
                              aria-label={`Xem chi tiết đơn hàng ${cartItem.id}`}
                            >
                              <Eye className="w-4 h-4" />
                              Chi tiết
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-all duration-200"
                              aria-label={`Liên hệ cửa hàng ${cartItem.shop}`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Liên hệ
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'purchase' ? 'Giỏ hàng trống' : 'Không có đơn hàng'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'purchase' 
                  ? 'Bạn chưa có sản phẩm nào trong giỏ hàng.' 
                  : 'Chưa có đơn hàng nào trong danh mục này.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}