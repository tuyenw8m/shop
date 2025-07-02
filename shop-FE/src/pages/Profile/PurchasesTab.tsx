import { useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ShoppingCart, Eye, MessageCircle, RefreshCw } from 'lucide-react';
import { formatPrices, getAccessToken } from 'src/utils/utils';
import { useCartMutations } from 'src/hooks/useCartMutations';
import { useCartQuery } from 'src/hooks/useCartQuery';
import { getProfileLocalStorage } from 'src/utils/utils';
import type { RootState } from 'src/app/store';
import { type Purchases, type TabType } from './types';
import React, { useState } from 'react';
import OrderModal from 'src/components/OrderModal';
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '../contexts/OrderContext';
import ConfirmCancelModal from 'src/components/ConfirmCancelModal';

interface PurchasesTabProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  purchases: Purchases;
  isLoading?: boolean;
}

export default function PurchasesTab({ activeTab, setActiveTab, purchases, isLoading = false }: PurchasesTabProps) {
  const userProfile = getProfileLocalStorage();
  const user_id = userProfile?.id;
  const navigate = useNavigate();
  const { refreshOrders } = useOrderContext();

  useCartQuery(user_id);

  const { items } = useSelector((state: RootState) => state.cart);
  const { updateCartItemQuantity, removeCartItem } = useCartMutations(user_id);

  // Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id?: string;
    product_id?: string;
    item_id?: string;
    product: string;
    price: string;
    image: string;
    quantity: number;
  } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelProductName, setCancelProductName] = useState<string | undefined>(undefined);
  const [cancelProductImage, setCancelProductImage] = useState<string | undefined>(undefined);

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

  // Mua ngay/mua lại: mở modal xác nhận
  const handleBuyNow = (cartItem: {
    id?: string;
    product_id?: string;
    item_id?: string;
    product: string;
    price: string;
    image: string;
    quantity: number;
  }) => {
    setSelectedProduct(cartItem);
    setOrderError(null);
    setShowOrderModal(true);
  };

  // Xác nhận đặt hàng
  const handleConfirmOrder = async () => {
    setOrderError(null);
    if (!userProfile?.phone || !userProfile?.address) {
      setOrderError('Vui lòng cập nhật số điện thoại và địa chỉ trong hồ sơ!');
      setTimeout(() => {
        setShowOrderModal(false);
        navigate('/profile');
      }, 1500);
      return;
    }
    try {
      const response = await fetch('http://localhost:8888/shop/api/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
<<<<<<< HEAD
          productId: selectedProduct.product_id || selectedProduct.id,
          quantity: selectedProduct.quantity || 1
=======
          product_id: selectedProduct?.product_id || selectedProduct?.id || '',
          quantity: selectedProduct?.quantity || 1,
          comment: ''
>>>>>>> 2fe38ddd65fb212ce751b6e1dd96bd8e3a919183
        }),
      });
      
      const responseData = await response.json();
      console.log('Order response:', responseData);
      
      if (!response.ok) {
        const errorText = responseData.message || await response.text();
        setOrderError('Đặt hàng thất bại: ' + errorText);
        return;
      }
      
      setSuccessMessage('Đặt hàng thành công! ');
      
      // Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
      if (selectedProduct?.item_id && user_id) {
        removeCartItem.mutate(selectedProduct.item_id);
      }
      
      setTimeout(() => {
        setShowOrderModal(false);
        setSuccessMessage(null);
        refreshOrders();
        // Không navigate để user có thể thấy order mới trong tab "Chờ thanh toán"
      }, 2000);
    } catch (err) {
      setOrderError('Đặt hàng thất bại!');
      console.error('Order error:', err);
    }
  };

  // Hủy đơn hàng: mở modal xác nhận
  const handleOpenCancelModal = (orderId: string, productName?: string, productImage?: string) => {
    setCancelOrderId(orderId);
    setCancelProductName(productName);
    setCancelProductImage(productImage);
    setShowCancelModal(true);
  };

  // Hủy đơn hàng: xác nhận trong modal
  const handleConfirmCancelOrder = async () => {
    if (!cancelOrderId) return;
    try {
      const response = await fetch(`http://localhost:8888/shop/api/v1/orders/${cancelOrderId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        setShowCancelModal(false);
        alert('Hủy đơn hàng thất bại: ' + errorText);
        return;
      }
      setShowCancelModal(false);
      refreshOrders();
      // Có thể show toast hoặc modal thành công nếu muốn
    } catch (err) {
      setShowCancelModal(false);
      alert('Hủy đơn hàng thất bại! Vui lòng thử lại sau.');
      console.error('Cancel order error:', err);
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
    
    // Hiển thị đơn hàng từ backend
    const orders = purchases[activeTab as keyof Purchases] || [];
    console.log(`📋 Orders for ${activeTab}:`, orders);
    
    return orders.map((order) => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString('vi-VN'),
      product: order.product?.name || `Đơn hàng #${order.id.slice(-8)}`,
      originalPrice: formatPrices(order.price),
      price: formatPrices(order.price),
      totalPrice: formatPrices(order.total_price),
      status: (() => {
        switch (order.status) {
          case 'PENDING': return 'Chờ thanh toán';
          case 'CONFIRMED': return 'Đã xác nhận';
          case 'SHIPPED': return 'Đang vận chuyển';
          case 'DELIVERED': return 'Đã giao hàng';
          case 'CANCELLED': return 'Đã hủy';
          default: return order.status;
        }
      })(),
      shop: '5TECH Store',
      image: order.product?.image_url?.[0] || '/placeholder.svg',
      quantity: order.items_count,
      isCartItem: false,
      order_id: order.id,
      product_id: order.product_id
    }));
  };

  const activeItems = getActiveItems();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {showOrderModal && selectedProduct && (
        <OrderModal
          user={userProfile}
          product={{
            id: selectedProduct?.product_id || selectedProduct?.id || '',
            name: selectedProduct?.product || '',
            price: Number(selectedProduct?.price?.toString().replace(/[^\d]/g, '') || '0'),
            image_url: [selectedProduct?.image || ''],
          }}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowOrderModal(false)}
          error={orderError || undefined}
          successMessage={successMessage || undefined}
        />
      )}
      {showCancelModal && (
        <ConfirmCancelModal
          onConfirm={handleConfirmCancelOrder}
          onClose={() => setShowCancelModal(false)}
          productName={cancelProductName}
          productImage={cancelProductImage}
        />
      )}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Đơn Mua</h2>
            <p className="text-sm lg:text-base text-gray-600">Quản lý đơn hàng và giỏ hàng của bạn</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-1 lg:gap-2">
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
              className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg transition-all duration-200 text-xs lg:text-sm ${
                activeTab === key
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600 hover:shadow-md'
              }`}
              aria-label={`Xem ${label}`}
            >
              <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="font-medium">{label}</span>
              {key === 'purchase' && items.length > 0 && (
                <span className="bg-white text-green-600 text-xs font-bold px-1 lg:px-2 py-0.5 lg:py-1 rounded-full">
                  {items.length}
                </span>
              )}
              {key !== 'purchase' && purchases[key as keyof Purchases]?.length > 0 && (
                <span className="bg-white text-green-600 text-xs font-bold px-1 lg:px-2 py-0.5 lg:py-1 rounded-full">
                  {purchases[key as keyof Purchases]?.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder=" Tìm đơn hàng hoặc sản phẩm..."
            className="w-full p-3 lg:p-4 pl-10 lg:pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm lg:text-base"
            title="Chức năng tìm kiếm đang được phát triển"
            disabled
            aria-label="Tìm kiếm đơn hàng"
          />
          <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 lg:py-12">
              <div className="text-gray-400 mb-4">
                <RefreshCw className="w-12 h-12 lg:w-16 lg:h-16 mx-auto animate-spin" />
              </div>
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                Đang tải đơn hàng...
              </h3>
              <p className="text-sm lg:text-base text-gray-500">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          ) : activeItems.length > 0 ? (
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
                order_id?: string;
                address?: string;
                phone?: string;
              };
              return (
              <div
                key={cartItem.id}
                className="group bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 overflow-hidden"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex items-start gap-3 lg:gap-4 flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={cartItem.image}
                          alt={cartItem.product}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        {cartItem.isCartItem && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1 lg:px-2 py-0.5 lg:py-1 rounded-full">
                            🛒
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 lg:gap-2 mb-2">
                          <p className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {cartItem.date}
                          </p>
                          {cartItem.isCartItem && (
                            <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                              Trong giỏ hàng
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm lg:text-lg mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {cartItem.product}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-500 mb-2">🏪 {cartItem.shop}</p>
                        
                        {/* Price Display */}
                        <div className="flex items-center gap-2 lg:gap-3 mb-3">
                          <span className="text-base lg:text-lg font-bold text-red-600">{cartItem.price}</span>
                          {cartItem.originalPrice !== cartItem.price && (
                            <span className="text-xs lg:text-sm text-gray-400 line-through">{cartItem.originalPrice}</span>
                          )}
                        </div>

                        {/* Quantity Controls for Cart Items */}
                        {cartItem.isCartItem && (
                          <div className="flex items-center gap-2 lg:gap-4 mb-3">
                            <span className="text-xs lg:text-sm text-gray-600">Số lượng:</span>
                            <div className="flex items-center space-x-1 lg:space-x-2 border border-gray-300 rounded-lg bg-white">
                              <button
                                onClick={() => handleUpdateQuantityChange(cartItem.item_id, cartItem.product_id, cartItem.quantity - 1)}
                                disabled={cartItem.quantity <= 1}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-6 h-6 lg:w-8 lg:h-8 p-0 hover:bg-gray-100"
                              >
                                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <span className="w-8 lg:w-12 text-center font-medium text-sm lg:text-base">{cartItem.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantityChange(cartItem.item_id, cartItem.product_id, cartItem.quantity + 1)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-6 h-6 lg:w-8 lg:h-8 p-0 hover:bg-gray-100"
                              >
                                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        <p
                          className="text-xs lg:text-sm font-medium inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: (() => {
                              switch (cartItem.status) {
                                case 'Đã giao hàng': return '#dcfce7';
                                case 'Đang vận chuyển': return '#dbeafe';
                                case 'Đã xác nhận': return '#fef3c7';
                                case 'Chờ thanh toán': return '#fef2f2';
                                case 'Đã hủy': return '#fee2e2';
                                default: return '#f3f4f6';
                              }
                            })(),
                            color: (() => {
                              switch (cartItem.status) {
                                case 'Đã giao hàng': return '#166534';
                                case 'Đang vận chuyển': return '#1e40af';
                                case 'Đã xác nhận': return '#92400e';
                                case 'Chờ thanh toán': return '#dc2626';
                                case 'Đã hủy': return '#991b1b';
                                default: return '#374151';
                              }
                            })()
                          }}
                        >
                          {cartItem.status}
                        </p>

                        {!cartItem.isCartItem && cartItem.address && (
                          <p className="text-xs lg:text-sm text-gray-500 mb-1">Địa chỉ nhận: {cartItem.address}</p>
                        )}
                        {!cartItem.isCartItem && cartItem.phone && (
                          <p className="text-xs lg:text-sm text-gray-500 mb-1">SĐT: {cartItem.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3 lg:ml-4">
                      <div className="text-left lg:text-right">
                        <p className="text-xs lg:text-sm text-gray-500">Thành tiền:</p>
                        <p className="text-lg lg:text-xl font-bold text-red-600">{cartItem.totalPrice}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        {cartItem.isCartItem ? (
                          // Cart item actions
                          <>
                            <button
                              onClick={() => handleBuyNow(cartItem)}
                              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 text-xs lg:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              aria-label={`Mua ngay ${cartItem.product}`}
                            >
                              <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
                              Mua ngay
                            </button>
                            <button
                              onClick={() => handleRemoveFromCart(cartItem.item_id)}
                              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 text-xs lg:text-sm font-medium transition-all duration-200"
                              aria-label={`Xóa ${cartItem.product} khỏi giỏ hàng`}
                            >
                              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              Xóa
                            </button>
                          </>
                        ) : (
                          // Purchase item actions
                          <>
                            <button
                              onClick={() => handleBuyNow(cartItem)}
                              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 text-xs lg:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              aria-label={`Mua lại ${cartItem.product}`}
                            >
                              <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
                              Mua lại
                            </button>
                            {cartItem.status === 'Chờ thanh toán' && (
                              <button
                                onClick={() => handleOpenCancelModal(cartItem.id, cartItem.product, cartItem.image)}
                                className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs lg:text-sm font-medium transition-all duration-200"
                                aria-label={`Hủy đơn hàng ${cartItem.id}`}
                              >
                                <Trash2 className="w-4 h-4" /> Hủy đơn
                              </button>
                            )}
                            <button
                              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs lg:text-sm font-medium transition-all duration-200"
                              aria-label={`Xem chi tiết đơn hàng ${cartItem.id}`}
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                              Chi tiết
                            </button>
                            <button
                              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs lg:text-sm font-medium transition-all duration-200"
                              aria-label={`Liên hệ cửa hàng ${cartItem.shop}`}
                            >
                              <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
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
            <div className="text-center py-8 lg:py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" />
              </div>
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'purchase' ? 'Giỏ hàng trống' : 
                 activeTab === 'waitingPayment' ? 'Không có đơn hàng chờ thanh toán' :
                 activeTab === 'shipping' ? 'Không có đơn hàng đang vận chuyển' :
                 activeTab === 'waitingDelivery' ? 'Không có đơn hàng chờ giao' :
                 activeTab === 'completed' ? 'Không có đơn hàng đã hoàn thành' :
                 activeTab === 'cancelled' ? 'Không có đơn hàng đã hủy' :
                 'Không có đơn hàng'}
              </h3>
              <p className="text-sm lg:text-base text-gray-500">
                {activeTab === 'purchase' 
                  ? 'Bạn chưa có sản phẩm nào trong giỏ hàng.' 
                  : activeTab === 'waitingPayment'
                  ? 'Tất cả đơn hàng của bạn đã được thanh toán hoặc chưa có đơn hàng nào.'
                  : activeTab === 'shipping'
                  ? 'Hiện tại không có đơn hàng nào đang được vận chuyển.'
                  : activeTab === 'waitingDelivery'
                  ? 'Không có đơn hàng nào đang chờ giao đến bạn.'
                  : activeTab === 'completed'
                  ? 'Bạn chưa có đơn hàng nào đã hoàn thành.'
                  : activeTab === 'cancelled'
                  ? 'Bạn chưa có đơn hàng nào bị hủy.'
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