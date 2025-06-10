import type { RegisterOptions } from 'react-hook-form';
import * as yup from 'yup';

export const schema = yup.object({
  username: yup
    .string()
    .required('Tên người dùng là bắt buộc')
    .min(3, 'Tối thiểu 3 ký tự')
    .max(50, 'Tối đa 50 ký tự'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ')
    .min(5, 'Tối thiểu 5 ký tự')
    .max(160, 'Tối đa 160 ký tự'),
  password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(6, 'Tối thiểu 6 ký tự')
    .max(160, 'Tối đa 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Bạn chưa nhập mật khẩu')
    .min(6, 'Tối thiểu 6 ký tự')
    .max(160, 'Tối đa 160 ký tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp, kiểm tra lại !'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải là 10 chữ số'),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = schema.omit(['confirm_password', 'username', 'phone']);
export type FormDataTypeLogin = yup.InferType<typeof loginSchema>;
export type FormDataTypeRegister = yup.InferType<typeof schema>;