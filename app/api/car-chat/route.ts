import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Sample car database
const carDatabase = [
  {
    make: "Toyota",
    model: "RAV4 Hybrid",
    year: 2023,
    price: "$32,000",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Hybrid", "AWD", "Safety Sense 2.0"],
    mpg: "41 city / 38 hwy",
    horsepower: 219,
    type: "SUV",
    size: "Compact",
    luxury: false,
    electric: false,
    hybrid: true,
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2023,
    price: "$23,950",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Fuel Efficient", "Honda Sensing", "Apple CarPlay"],
    mpg: "33 city / 42 hwy",
    horsepower: 158,
    type: "Sedan",
    size: "Compact",
    luxury: false,
    electric: false,
    hybrid: false,
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: "$42,990",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Electric", "Autopilot", "358 mile range"],
    mpg: "132 MPGe",
    horsepower: 283,
    type: "Sedan",
    size: "Mid-size",
    luxury: true,
    electric: true,
    hybrid: false,
  },
  {
    make: "Ford",
    model: "F-150",
    year: 2023,
    price: "$34,585",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Towing Capacity", "Pro Power Onboard", "SYNC 4"],
    mpg: "25 city / 26 hwy",
    horsepower: 400,
    type: "Truck",
    size: "Full-size",
    luxury: false,
    electric: false,
    hybrid: false,
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: "$43,800",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Luxury", "Sport Mode", "iDrive 7.0"],
    mpg: "26 city / 36 hwy",
    horsepower: 255,
    type: "Sedan",
    size: "Compact",
    luxury: true,
    electric: false,
    hybrid: false,
  },
  {
    make: "Mazda",
    model: "CX-5",
    year: 2023,
    price: "$26,700",
    image: "/placeholder.svg?height=192&width=384",
    features: ["AWD", "Skyactiv Technology", "i-Activsense"],
    mpg: "24 city / 30 hwy",
    horsepower: 187,
    type: "SUV",
    size: "Compact",
    luxury: false,
    electric: false,
    hybrid: false,
  },
  {
    make: "Audi",
    model: "Q5",
    year: 2023,
    price: "$43,500",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Quattro AWD", "Virtual Cockpit", "Premium Audio"],
    mpg: "23 city / 28 hwy",
    horsepower: 261,
    type: "SUV",
    size: "Compact",
    luxury: true,
    electric: false,
    hybrid: false,
  },
  {
    make: "Hyundai",
    model: "Tucson Hybrid",
    year: 2023,
    price: "$30,900",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Hybrid", "BlueLink", "SmartSense"],
    mpg: "38 city / 38 hwy",
    horsepower: 226,
    type: "SUV",
    size: "Compact",
    luxury: false,
    electric: false,
    hybrid: true,
  },
  {
    make: "Chevrolet",
    model: "Bolt EV",
    year: 2023,
    price: "$26,500",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Electric", "259 mile range", "Fast Charging"],
    mpg: "131 MPGe",
    horsepower: 200,
    type: "Hatchback",
    size: "Compact",
    luxury: false,
    electric: true,
    hybrid: false,
  },
  {
    make: "Porsche",
    model: "911",
    year: 2023,
    price: "$106,100",
    image: "/placeholder.svg?height=192&width=384",
    features: ["Sports Car", "PDK Transmission", "Launch Control"],
    mpg: "18 city / 25 hwy",
    horsepower: 379,
    type: "Sports Car",
    size: "Compact",
    luxury: true,
    electric: false,
    hybrid: false,
  },
]

// Allow responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // System prompt to guide the AI
  const systemPrompt = `
    You are a helpful car recommendation assistant. Help users find cars based on their preferences.
    
    After understanding the user's needs, recommend exactly 3 cars from the database that best match their criteria.
    
    When you're ready to recommend cars, format your response like this:
    1. First, provide a brief explanation of why you're recommending these cars
    2. Then add the exact string "CAR_RECOMMENDATIONS:" followed by a JSON array of 3 car objects
    
    Example format:
    Based on your preferences, here are three cars that would be perfect for you:
    CAR_RECOMMENDATIONS:[{"make":"Toyota","model":"RAV4","year":2023,"price":"$32,000","image":"/placeholder.svg?height=192&width=384","features":["Feature 1","Feature 2","Feature 3"],"mpg":"30 mpg","horsepower":203}]
    
    Available cars in the database: ${JSON.stringify(carDatabase)}
  `

  // Create a new array with the system message and user messages
  const conversationMessages = [{ role: "system", content: systemPrompt }, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: conversationMessages,
  })

  return result.toDataStreamResponse()
}
