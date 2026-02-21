export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  savedNotes?: string[]
  createdAt: string
}

export interface Comment {
  _id: string
  user: Pick<User, '_id' | 'username' | 'avatar'>
  text: string
  createdAt: string
}

export interface NoteLocation {
  type: 'Point'
  coordinates: [number, number] // [lng, lat]
  name?: string
  isExact: boolean
}

export interface Note {
  _id: string
  author: Pick<User, '_id' | 'username' | 'avatar'>
  title: string
  body: string
  location: NoteLocation
  tags: string[]
  likes: string[]
  likesCount: number
  comments: Comment[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedNotes {
  notes: Note[]
  total: number
  pages: number
}

export interface CreateNotePayload {
  title: string
  body: string
  lat: number
  lng: number
  locationName?: string
  isExact?: boolean
  tags?: string[]
  isPublic?: boolean
}