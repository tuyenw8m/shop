interface BankFormProps {
  bankData: { bankName: string; accountNumber: string; accountHolder: string };
  setBankData: (data: { bankName: string; accountNumber: string; accountHolder: string }) => void;
  bankError: string | null;
  isLoadingBank: boolean;
  handleSaveBankProfile: () => void;
}

export default function BankForm({ bankData, setBankData, bankError, isLoadingBank, handleSaveBankProfile }: BankFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hồ Sơ Ngân Hàng</h2>
      <p className="text-sm text-gray-500 mb-6">Quản lý thông tin ngân hàng của bạn</p>
      {bankError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{bankError}</div>
      )}
      <div className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">Tên ngân hàng</label>
          <input
            id="bankName"
            type="text"
            value={bankData.bankName}
            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">Số tài khoản</label>
          <input
            id="accountNumber"
            type="text"
            value={bankData.accountNumber}
            onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-2">Tên chủ tài khoản</label>
          <input
            id="accountHolder"
            type="text"
            value={bankData.accountHolder}
            onChange={(e) => setBankData({ ...bankData, accountHolder: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <button
          onClick={handleSaveBankProfile}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200"
          disabled={isLoadingBank}
        >
          {isLoadingBank ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}