import Footer from 'src/components/Footer';
import Header from 'src/components/Header';

interface Props {
  children?: React.ReactNode;
  isProductPage?: boolean; // Để kiểm soát hiển thị chức năng
}

export default function WebLayout({ children, isProductPage = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header isProductPage={isProductPage} />
      {isProductPage && (
        <div className="bg-teal-700 text-white p-2 flex justify-between items-center">
          {/* Tabs Phân Loại */}
          <div className="flex space-x-4">
            <button className="hover:bg-teal-600 p-2 rounded">Chức năng</button>
            <button className="hover:bg-teal-600 p-2 rounded">Chức năng</button>
            <button className="hover:bg-teal-600 p-2 rounded">Chức năng</button>
          </div>
          {/* Nút Giỏ Hàng */}
          <button className="bg-yellow-500 text-teal-800 p-2 rounded hover:bg-yellow-600">
            Giỏ Hàng (0)
          </button>
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}