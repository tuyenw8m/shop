import type { RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

type Rules = {
  [key in keyof FormData]: RegisterOptions<FormData>
}

export const rules: Rules = {
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    minLength: {
      value: 5,
      message: 'Độ dài tối thiểu là 5 kí tự'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài tối đa là 160 kí tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Nhập password là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Độ dài tối thiểu là 6 kí tự'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài tối đa là 160 kí tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Xác nhận password là bắt buộc'
    },
    validate: (value, formValues) => value === formValues.password || 'Mật khẩu không khớp'
  }
}

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
