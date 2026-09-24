export interface ReadSession {
  id?: string
  date: string
  pagesAdded: number
  startPage?: number
  endPage?: number
  startPageRaw?: string
  endPageRaw?: string
  displayRange?: string
  isRoman?: boolean
  includePrefacePages?: boolean
  totalPrefacePages?: number
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
  totalPrefacePages?: number
  includePrefacePages?: boolean
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

export type SortOption = 'default' | 'terbaru' | 'terlama' | 'halaman_terbanyak' | 'halaman_tersedikit' | 'harga_tinggi' | 'harga_rendah' | 'progress_tinggi' | 'progress_rendah'