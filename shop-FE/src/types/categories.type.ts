export interface Category {
  id: string
  name: string
  description: string
  slug: string
  children?: ChildCategory[] | null
  branch_name?: string[] | null
}

export interface ChildCategory {
  id: string
  name: string
  description: string
  slug: string
  children?: ChildCategory[] | null
  branch_name?: string[] | null
}
