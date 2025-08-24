import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API utility functions
export interface CreateUserRequest {
  phone_number: string
  points_of_interest: Array<{
    latitud: string
    longitud: string
  }>
}

export interface CreateUserResponse {
  success: boolean
  message?: string
  user_id?: string
}

export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
    if (!apiUrl) {
      throw new Error('Backend API URL not configured')
    }

    const response = await fetch(`${apiUrl}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user_id: data.user_id || data.id
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar usuário'
    }
  }
}

export interface OccurrenceLocation {
  id: string
  lat: number
  lng: number
  date: string
}

export interface FetchOccurrencesResponse {
  occurrences: OccurrenceLocation[]
  total_count: number
}

export async function fetchOccurrences(): Promise<OccurrenceLocation[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
    if (!apiUrl) {
      throw new Error('Backend API URL not configured')
    }

    const response = await fetch(`${apiUrl}/occurrences/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*'
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: FetchOccurrencesResponse = await response.json()
    
    // The backend returns the data directly without a 'success' wrapper
    return data.occurrences || []
  } catch (error) {
    console.error('Error fetching occurrences:', error)
    throw error
  }
}
