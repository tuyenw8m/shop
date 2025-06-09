import React from 'react'

function Footer() {
  return (
    <footer className='px-4 sm:px-6 py-8 bg-[#027d73] text-gray-200'>
      <div className='max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6'>
        <div>
          <h3 className='font-bold text-white mb-3'>Hỗ trợ - dịch vụ</h3>
          <ul className='space-y-2 text-white/90 text-sm md:text-base'>
            <li>Chính sách và hướng dẫn mua hàng trả góp</li>
            <li>Hướng dẫn mua hàng và chính sách vận chuyển</li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-white mb-3'>Thông tin liên hệ</h3>
          <ul className='space-y-2 text-white/90 text-sm md:text-base'>
            <li>Thông tin các trang TMDT</li>
            <li>Chăm sóc khách hàng</li>
            <li>Tra cứu bảo hành</li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-white mb-3'>Thanh toán miễn phí</h3>
          <div className='grid grid-cols-3 gap-2'>
            <img src='https://placehold.co/60x30?text=VISA' alt='Visa' />
            <img src='https://placehold.co/60x30?text=MasterCard' alt='MasterCard' />
            <img src='https://placehold.co/60x30?text=Momo' alt='Momo' />
            <img src='https://placehold.co/60x30?text=VNPay+QR' alt='VNPay QR' />
            <img src='https://placehold.co/60x30?text=ZaloPay' alt='ZaloPay' />
          </div>

          <h3 className='font-bold text-white mt-6 mb-3'>Hình thức vận chuyển</h3>
          <div className='flex space-x-4 flex-wrap'>
            <img src='https://placehold.co/80x30?text=Ahmove+Express' alt='Ahamove' />
            <img src='https://placehold.co/80x30?text=Vietnam+Post' alt='Vietnam Post' />
          </div>
        </div>

        {/* Tổng đài */}
        <div>
          <h3 className='font-bold text-white mb-3'>Tổng đài</h3>
          <div className='bg-white text-[#00534c] text-center font-bold text-xl py-2 rounded-md w-32'>1900.XXXX</div>
          <p className='mt-1 text-white/90'>(Từ 00h - 23h59p)</p>

          <h3 className='font-bold text-white mt-6 mb-3'>Kết nối với chúng tôi</h3>
          <div className='flex items-center space-x-3 text-white text-2xl'>
            <i className='fab fa-facebook-f'></i>
            <i className='fab fa-tiktok'></i>
            <i className='fab fa-youtube'></i>
            <i className='fab fa-instagram'></i>
            <i className='fas fa-camera'></i>
          </div>
        </div>

        {/* Bộ Công Thương */}
        <div className='flex items-center justify-center'>
          <img src='https://placehold.co/130x60?text=Thông+Báo+Bộ+Công+Thương' alt='Thông báo Bộ Công Thương' />
        </div>
      </div>

      {/* Bottom text */}
      <div className='mt-8 text-center text-white/80 text-sm space-y-1 px-2'>
        <p>2025. ANH CHAI XÂY WEB (Bản thử nghiệm beta xịn xò con người và AI)</p>
        <p className='font-bold'>GP số 999/GP-TTĐT do sở TTTT Hà Nội cấp ngày 30/02/2025</p>
        <p>
          Địa chỉ: Số 89 Đường Tam Trinh, Phường Mai Động, Quận Hoàng Mai, Thành Phố Hà Nội, Việt Nam. Điện thoại:
          1900.2091. Chịu trách nhiệm nội dung: SÁNG TUYỀN QUÂN.
        </p>
      </div>
    </footer>
  )
}

export default Footer
