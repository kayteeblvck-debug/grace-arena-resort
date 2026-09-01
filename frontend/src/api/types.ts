export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

/* ---------- rooms ---------- */

export interface Room {
  id: number
  slug: string
  name: string
  tagline?: string
  description: string
  longDescription?: string
  pricePerNight: number
  capacity: number
  bedType?: string
  sizeSqm?: number
  outlook?: string
  imageUrl?: string
  gallery: string[]
  amenities: string[]
  totalUnits: number
  available: boolean
  featured: boolean
}

/** A room priced and checked against one specific date range. */
export interface RoomAvailability {
  room: Room
  unitsLeft: number
  bookable: boolean
  /** Why it is not bookable — only present when `bookable` is false. */
  reason?: string
  nights: number
  totalAmount: number
}

/* ---------- accounts ---------- */

export type Role = 'GUEST' | 'ADMIN'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: Role
  emailVerified: boolean
  createdAt: string
}

export interface AuthResult {
  token: string
  expiresInSeconds: number
  user: User
}

export interface RegistrationResult {
  user: User
  /** Development only — present when the API is configured to expose the link. */
  verificationUrl?: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
}

/* ---------- bookings ---------- */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: number
  reference: string
  roomId: number
  roomSlug: string
  roomName: string
  roomImageUrl?: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  specialRequests?: string
  pricePerNight: number
  totalAmount: number
  status: BookingStatus
  cancellable: boolean
  createdAt: string
}

export interface BookingRequest {
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  guestName?: string
  guestPhone?: string
  specialRequests?: string
}

/* ---------- enquiries ---------- */

export type EnquiryType =
  | 'GENERAL'
  | 'WEDDING'
  | 'CONFERENCE'
  | 'CORPORATE_RETREAT'
  | 'CELEBRATION'
  | 'GROUP_STAY'

export type EnquiryStatus = 'NEW' | 'IN_PROGRESS' | 'CLOSED'

export interface EnquiryRequest {
  name: string
  email: string
  phone?: string
  type: EnquiryType
  preferredDate?: string
  expectedGuests?: number
  message: string
}

export interface EnquiryReceipt {
  reference: string
}

export interface Enquiry {
  id: number
  reference: string
  name: string
  email: string
  phone?: string
  type: EnquiryType
  preferredDate?: string
  expectedGuests?: number
  message: string
  status: EnquiryStatus
  createdAt: string
}
