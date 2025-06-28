interface AddressFormProps {
  editData: { address: string };
  setEditData: (data: { address: string }) => void;
  error: string | null;
  isLoadingProfile: boolean;
  handleSaveAddress: () => void;
}

export default function AddressForm({ editData, setEditData, error, isLoadingProfile, handleSaveAddress }: AddressFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Địa Chỉ</h2>
      <p className="text-sm text-gray-500 mb-6">Quản lý địa chỉ giao hàng của bạn</p>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
      )}
      <div className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
          <input
            id="address"
            type="text"
            value={editData.address}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <button
          onClick={handleSaveAddress}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200"
          disabled={isLoadingProfile}
        >
          {isLoadingProfile ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}