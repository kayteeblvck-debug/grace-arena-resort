export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

export interface Room {
  id: number
  slug: string
  name: string
  description: string
  pricePerNight: number
  capacity: number
  imageUrl: string
  available: boolean
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: number
  reference: string
  roomId: number
  roomName: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

export interface BookingRequest {
  roomId: number
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  guests: number
}
