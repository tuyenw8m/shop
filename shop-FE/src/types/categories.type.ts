import type { SuccessResponse } from './utils.type'

export interface Category {
  name: string
  description: string
  id: string
  children: {
    name: string
    description: string
    id: string
    children: null
    branch_name: string[]
  }[]
  branch_name: null
}

export type CategoriesList = SuccessResponse<Category[]>
