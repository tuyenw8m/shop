import http from 'src/utils/http'

export const getListAllProduct = () => {
  http.get('/product')
}
