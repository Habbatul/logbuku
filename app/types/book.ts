export interface ReadSession {
  id?: string
  date: string
  pagesAdded: number
  startPage?: number
  endPage?: number
  duration?: number | null
}

export interface Book {
  id?: string | number | null
  title: string
  author?: string
  publisher?: string
  date: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  isTarget?: boolean
  topic: string[]
  totalPages: number
  pagesRead: number
  price: number
  imageUrl?: string
  isPinned?: boolean
  readHistory?: ReadSession[]
}

export interface BookFormData {
  id: string | number | null
  title: string
  author?: string
  publisher?: string
  date: string
  topic: string[]
  totalPages: number | null
  pagesRead: number
  price: number | null
  imageUrl: string
}

export type SortOption = 'default' | 'terbaru' | 'terlama' | 'harga_tinggi' | 'harga_rendah'