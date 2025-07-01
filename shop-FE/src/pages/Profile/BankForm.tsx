interface BankFormProps {
  bankData: { bankName: string; accountNumber: string; accountHolder: string };
  setBankData: (data: { bankName: string; accountNumber: string; accountHolder: string }) => void;
  bankError: string | null;
  isLoadingBank: boolean;
  handleSaveBankProfile: () => void;
  successMessage?: string | null;
}

export default function BankForm({ bankData, setBankData, bankError, isLoadingBank, handleSaveBankProfile, successMessage }: BankFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông Tin Ngân Hàng</h2>
          <p className="text-gray-600">Quản lý thông tin tài khoản ngân hàng của bạn</p>
        </div>

        {bankError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{bankError}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-green-800 text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên ngân hàng <span className="text-red-500">*</span>
            </label>
            <input
              id="bankName"
              type="text"
              value={bankData.bankName}
              onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Ví dụ: Vietcombank, BIDV, Agribank..."
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Số tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              id="accountNumber"
              type="text"
              value={bankData.accountNumber}
              onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập số tài khoản ngân hàng"
            />
          </div>

          <div>
            <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-2">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              id="accountHolder"
              type="text"
              value={bankData.accountHolder}
              onChange={(e) => setBankData({ ...bankData, accountHolder: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập tên chủ tài khoản"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveBankProfile}
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
              disabled={isLoadingBank}
            >
              {isLoadingBank ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang lưu...</span>
                </div>
              ) : (
                'Lưu thông tin'
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Lưu ý bảo mật</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Thông tin ngân hàng của bạn sẽ được mã hóa và bảo mật. Chỉ sử dụng cho mục đích thanh toán và hoàn tiền.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}