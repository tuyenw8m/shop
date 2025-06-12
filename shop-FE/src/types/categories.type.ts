import type { SuccessResponse } from './utils.type'

export interface Category {
  id: string
  name: string
  description: string
}

export type CategoriesList = SuccessResponse<Category[]>
