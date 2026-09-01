import type {
  ApiResponse,
  AuthResult,
  Booking,
  BookingRequest,
  BookingStatus,
  Enquiry,
  EnquiryReceipt,
  EnquiryRequest,
  EnquiryStatus,
  RegisterRequest,
  RegistrationResult,
  Room,
  RoomAvailability,
  User,
} from './types'

// Dev goes through the Vite proxy; set VITE_API_BASE_URL for deployed builds.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const TOKEN_KEY = 'gar.token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  /** The account exists and the password matched, but the email is unconfirmed. */
  get isUnverifiedEmail(): boolean {
    return this.status === 403 && /confirm your email/i.test(this.message)
  }
}

/* ---------- bearer token ---------- */

let token: string | null = null

export function loadStoredToken(): string | null {
  if (token === null) {
    try {
      token = localStorage.getItem(TOKEN_KEY)
    } catch {
      // Private browsing or a blocked storage partition — run without persistence.
      token = null
    }
  }
  return token
}

export function setToken(next: string | null): void {
  token = next
  try {
    if (next) localStorage.setItem(TOKEN_KEY, next)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Not fatal: the token still works for this tab, it just will not survive a reload.
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const bearer = loadStoredToken()
  if (bearer) headers.set('Authorization', `Bearer ${bearer}`)

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  let body: ApiResponse<T> | null = null
  try {
    body = (await response.json()) as ApiResponse<T>
  } catch {
    // Fall through to the status-based error below.
  }

  if (!response.ok || !body?.success) {
    throw new ApiError(body?.message ?? `Request failed (${response.status})`, response.status)
  }

  return body.data as T
}

const post = <T>(path: string, payload?: unknown) =>
  request<T>(path, { method: 'POST', body: payload === undefined ? undefined : JSON.stringify(payload) })

export const api = {
  /* rooms */
  listRooms: (availableOnly = false) => request<Room[]>(`/v1/rooms?availableOnly=${availableOnly}`),

  getRoom: (slug: string) => request<Room>(`/v1/rooms/${slug}`),

  /** What is actually free, and what the whole stay costs, for one date range. */
  checkAvailability: (checkIn: string, checkOut: string, guests: number) =>
    request<RoomAvailability[]>(
      `/v1/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
    ),

  /* accounts */
  register: (payload: RegisterRequest) => post<RegistrationResult>('/v1/auth/register', payload),

  verifyEmail: (verificationToken: string) =>
    post<AuthResult>('/v1/auth/verify', { token: verificationToken }),

  resendVerification: (email: string) => post<void>('/v1/auth/resend-verification', { email }),

  login: (email: string, password: string) => post<AuthResult>('/v1/auth/login', { email, password }),

  me: () => request<User>('/v1/auth/me'),

  /* bookings */
  createBooking: (payload: BookingRequest) => post<Booking>('/v1/bookings', payload),

  myBookings: () => request<Booking[]>('/v1/bookings/me'),

  getBooking: (reference: string) => request<Booking>(`/v1/bookings/${reference}`),

  cancelBooking: (reference: string) => post<Booking>(`/v1/bookings/${reference}/cancel`),

  /* enquiries */
  sendEnquiry: (payload: EnquiryRequest) => post<EnquiryReceipt>('/v1/enquiries', payload),

  /* reservations desk */
  listAllBookings: () => request<Booking[]>('/v1/bookings'),

  updateBookingStatus: (reference: string, status: BookingStatus) =>
    request<Booking>(`/v1/bookings/${reference}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  listEnquiries: () => request<Enquiry[]>('/v1/enquiries'),

  updateEnquiryStatus: (reference: string, status: EnquiryStatus) =>
    request<Enquiry>(`/v1/enquiries/${reference}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}
