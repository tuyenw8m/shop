import { useState } from 'react';

type AddressFormProps = {
  editData: { name: string; email: string; address: string; phone: string };
  setEditData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    address: string;
    phone: string;
  }>>;
  error: string | null;
  isLoadingProfile: boolean;
  handleSaveAddress: () => Promise<void>;
};

export default function AddressForm({
  editData,
  setEditData,
  error,
  isLoadingProfile,
  handleSaveAddress,
}: AddressFormProps) {
  return (
    <div className="space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex items-center space-x-4">
        <label className="w-32 text-sm font-medium text-gray-700">Địa chỉ</label>
        <input
          type="text"
          value={editData.address}
          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
          className="flex-1 p-2 border rounded text-sm text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập địa chỉ của bạn"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSaveAddress}
          className="px-6 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoadingProfile}
        >
          {isLoadingProfile ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}