export default function ProductList() {
  // Dữ liệu mẫu cho sản phẩm
  const products = [
    {
      id: 1,
      name: 'ví dụ',
      price: 'ví dụ',
      image: 'ví dụ', // Thay bằng URL ảnh thực tế
    },
    {
      id: 2,
      name: 'ví dụ',
      price: 'ví dụ',
      image: 'ví dụ',
    },
    {
      id: 3,
      name: 'ví dụ',
      price: 'ví dụ',
      image: 'ví dụ',
    },
    {
      id: 4,
      name: 'ví dụ',
      price: 'ví dụ',
      image: 'ví dụ',
    },
    {
      id: 5,
      name: 'ví dụ',
      price: 'ví dụ',
      image: 'ví dụ',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="relative">
        <div className="container mx-auto p-6 flex">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-green-600 font-bold mt-2">{product.price}</p>
                <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded-full hover:bg-teal-700 transition-colors">
                  Thêm vào giỏ hàng 
                </button>
              </div>
            ))}
          </div>

          {/* Product Filter */}
          <div className="w-64 ml-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">LỌC SẢN PHẨM</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá (Vnd)</label>
                <input
                  type="number"
                  placeholder="Nhỏ nhất"
                  className="w-full p-2 border rounded mt-1"
                />
                <input
                  type="number"
                  placeholder="Lớn nhất"
                  className="w-full p-2 border rounded mt-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phân loại</label>
                <select className="w-full p-2 border rounded mt-1">
                  <option>Tất cả</option>
                  <option>Điện Tử</option>
                  <option>Phụ kiện</option>
                </select>
              </div>
              <button className="w-full bg-teal-600 text-white py-2 rounded-full hover:bg-teal-700 transition-colors">
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
}