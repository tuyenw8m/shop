import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { type FormDataTypeRegister } from 'src/utils/rulesValidate'
import { schema } from 'src/utils/rulesValidate'

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataTypeRegister>({
    resolver: yupResolver(schema)
  })

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <div className='bg-orange-500'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-md' onSubmit={onSubmit} noValidate>
              <div className='text-2xl text-center'>Đăng Ký</div>
              <Input
                type='email'
                errorMessage={errors?.email?.message}
                placeholder='Email'
                className='mt-8'
                name='email'
                register={register}
              />
              <Input
                type='password'
                errorMessage={errors?.password?.message}
                placeholder='Password'
                className='mt-3'
                name='password'
                register={register}
              />
              <Input
                type='password'
                errorMessage={errors?.confirm_password?.message}
                placeholder='Password'
                className='mt-3'
                name='confirm_password'
                register={register}
              />

              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng Ký
                </button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-300'>Bạn đã có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
