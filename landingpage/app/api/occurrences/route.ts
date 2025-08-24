import { NextResponse } from 'next/server'

// Mock data - replace with actual database query
const mockOccurrences = [
  {
    id: 1,
    lat: -23.5505,
    lng: -46.6333,
    description: "Manada de javalis avistada em área rural",
    date: "2025-01-24",
    numberOfJavalis: 8,
    severity: "medium",
    reportedBy: "João Silva"
  },
  {
    id: 2,
    lat: -25.4284,
    lng: -49.2733,
    description: "Javalis destruindo plantação de milho",
    date: "2025-01-23",
    numberOfJavalis: 12,
    severity: "high",
    reportedBy: "Maria Santos"
  },
  {
    id: 3,
    lat: -30.0346,
    lng: -51.2177,
    description: "Avistamento próximo à reserva florestal",
    date: "2025-01-22",
    numberOfJavalis: 5,
    severity: "low",
    reportedBy: "Carlos Oliveira"
  },
  {
    id: 4,
    lat: -19.9167,
    lng: -43.9345,
    description: "Javalis em área urbana próxima ao parque",
    date: "2025-01-21",
    numberOfJavalis: 15,
    severity: "high",
    reportedBy: "Ana Costa"
  },
  {
    id: 5,
    lat: -15.7801,
    lng: -47.9292,
    description: "Manada próxima à área de preservação",
    date: "2025-01-20",
    numberOfJavalis: 10,
    severity: "medium",
    reportedBy: "Pedro Lima"
  },
  {
    id: 6,
    lat: -27.5969,
    lng: -48.5495,
    description: "Javalis em área de mata atlântica",
    date: "2025-01-19",
    numberOfJavalis: 7,
    severity: "low",
    reportedBy: "Lucia Ferreira"
  },
  {
    id: 7,
    lat: -22.9068,
    lng: -43.1729,
    description: "Avistamento em zona rural próxima à cidade",
    date: "2025-01-18",
    numberOfJavalis: 20,
    severity: "high",
    reportedBy: "Roberto Almeida"
  },
  {
    id: 8,
    lat: -26.3044,
    lng: -48.8467,
    description: "Javalis em área de reflorestamento",
    date: "2025-01-17",
    numberOfJavalis: 6,
    severity: "medium",
    reportedBy: "Fernanda Rocha"
  },
  {
    id: 9,
    lat: -20.2976,
    lng: -40.2958,
    description: "Manada próxima à praia",
    date: "2025-01-16",
    numberOfJavalis: 9,
    severity: "low",
    reportedBy: "Ricardo Mendes"
  },
  {
    id: 10,
    lat: -29.6914,
    lng: -53.8008,
    description: "Javalis em área de plantação de soja",
    date: "2025-01-15",
    numberOfJavalis: 18,
    severity: "high",
    reportedBy: "Patricia Souza"
  }
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // In a real application, you would:
    // 1. Query your database for occurrences
    // 2. Apply filters (date range, location, etc.)
    // 3. Format the data
    // 4. Return the response
    
    return NextResponse.json({
      success: true,
      occurrences: mockOccurrences,
      total: mockOccurrences.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching occurrences:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Example of how to add a new occurrence
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { lat, lng, description, numberOfJavalis, severity, reportedBy } = body
    
    if (!lat || !lng || !description || !numberOfJavalis || !severity || !reportedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Todos os campos são obrigatórios',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // In a real application, you would:
    // 1. Validate the data
    // 2. Save to database
    // 3. Send notifications to nearby users
    // 4. Return success response
    
    const newOccurrence = {
      id: Date.now(), // Use proper ID generation in production
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      description,
      date: new Date().toISOString().split('T')[0],
      numberOfJavalis: parseInt(numberOfJavalis),
      severity,
      reportedBy
    }
    
    // Add to mock data (in real app, this would be saved to database)
    mockOccurrences.unshift(newOccurrence)
    
    return NextResponse.json({
      success: true,
      occurrence: newOccurrence,
      message: 'Ocorrência registrada com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating occurrence:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 