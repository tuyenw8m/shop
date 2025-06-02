import type { RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

export const schema = yup.object({
  email: yup.string().required('Email là bắt buộc').email().min(5, 'Tối thiểu 5 kí tự').max(160, 'Tối đa 160 kí tự'),
  password: yup.string().required('Bạn chưa nhập mật khẩu').min(6, 'Tối thiểu 6 kí tự').max(160, 'Tối đa 160 kí tự'),
  confirm_password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(6, 'Tối thiểu 6 kí tự')
    .max(160, 'Tối đa 160 kí tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp, kiểm tra lại !')
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = schema.omit(['confirm_password'])
export type FormDataTypeLogin = yup.InferType<typeof loginSchema>
export type FormDataTypeRegister = yup.InferType<typeof schema>
