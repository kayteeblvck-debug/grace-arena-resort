import type { ApiResponse, Booking, BookingRequest, Room } from './types'

// Dev goes through the Vite proxy; set VITE_API_BASE_URL for deployed builds.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

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

export const api = {
  listRooms: (availableOnly = false) =>
    request<Room[]>(`/v1/rooms?availableOnly=${availableOnly}`),

  getRoom: (slug: string) => request<Room>(`/v1/rooms/${slug}`),

  createBooking: (payload: BookingRequest) =>
    request<Booking>('/v1/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listBookings: () => request<Booking[]>('/v1/bookings'),

  getBooking: (reference: string) => request<Booking>(`/v1/bookings/${reference}`),
}
