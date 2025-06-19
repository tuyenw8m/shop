export interface Category {
  name: string
  description: string
  id: string
  children: ChildCategory[]
  branch_name: null
}
export interface ChildCategory {
  name: string
  description: string
  id: string
  children: null
  branch_name: string[]
}
