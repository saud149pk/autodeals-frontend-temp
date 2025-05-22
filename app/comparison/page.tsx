"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample car data with detailed specifications
const carDatabase = [
  {
    id: 1,
    make: "Toyota",
    model: "RAV4 Hybrid",
    year: 2023,
    price: "$32,000",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    specs: {
      doors: 5,
      seats: 5,
      bootCapacity: "580 liters",
      wheelSize: "18 inches",
      engine: "2.5L Hybrid",
      horsepower: 219,
      fuelEconomy: "41 city / 38 hwy",
      transmission: "CVT",
      driveType: "AWD",
      length: "180.9 inches",
      width: "73.0 inches",
      height: "67.0 inches",
      weight: "3,710 lbs",
      fuelTank: "14.5 gallons",
      groundClearance: "8.1 inches",
    },
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2023,
    price: "$23,950",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    specs: {
      doors: 4,
      seats: 5,
      bootCapacity: "419 liters",
      wheelSize: "16 inches",
      engine: "2.0L 4-cylinder",
      horsepower: 158,
      fuelEconomy: "33 city / 42 hwy",
      transmission: "CVT",
      driveType: "FWD",
      length: "184.0 inches",
      width: "70.9 inches",
      height: "55.7 inches",
      weight: "2,877 lbs",
      fuelTank: "12.4 gallons",
      groundClearance: "5.3 inches",
    },
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: "$42,990",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    specs: {
      doors: 4,
      seats: 5,
      bootCapacity: "649 liters",
      wheelSize: "18 inches",
      engine: "Electric Motor",
      horsepower: 283,
      fuelEconomy: "132 MPGe",
      transmission: "Single-speed",
      driveType: "RWD",
      length: "184.8 inches",
      width: "72.8 inches",
      height: "56.8 inches",
      weight: "3,582 lbs",
      fuelTank: "N/A",
      groundClearance: "5.5 inches",
    },
  },
  {
    id: 4,
    make: "Ford",
    model: "F-150",
    year: 2023,
    price: "$34,585",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    specs: {
      doors: 4,
      seats: 6,
      bootCapacity: "1,495 liters",
      wheelSize: "20 inches",
      engine: "3.5L V6",
      horsepower: 400,
      fuelEconomy: "25 city / 26 hwy",
      transmission: "10-speed automatic",
      driveType: "4WD",
      length: "231.7 inches",
      width: "79.9 inches",
      height: "77.2 inches",
      weight: "4,021 lbs",
      fuelTank: "26.0 gallons",
      groundClearance: "9.4 inches",
    },
  },
  {
    id: 5,
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: "$43,800",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    specs: {
      doors: 4,
      seats: 5,
      bootCapacity: "480 liters",
      wheelSize: "19 inches",
      engine: "2.0L Turbo 4-cylinder",
      horsepower: 255,
      fuelEconomy: "26 city / 36 hwy",
      transmission: "8-speed automatic",
      driveType: "RWD",
      length: "185.7 inches",
      width: "71.9 inches",
      height: "56.8 inches",
      weight: "3,560 lbs",
      fuelTank: "15.6 gallons",
      groundClearance: "5.7 inches",
    },
  },
]

// Define the specification categories for the tabs
const specCategories = {
  basic: ["doors", "seats", "bootCapacity", "wheelSize"],
  performance: ["engine", "horsepower", "fuelEconomy", "transmission", "driveType"],
  dimensions: ["length", "width", "height", "weight", "fuelTank", "groundClearance"],
}

// Helper function to format spec names for display
const formatSpecName = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace("Boot", "Boot/Trunk")
}

export default function ComparisonPage() {
  const [leftCarId, setLeftCarId] = useState<number | null>(1)
  const [rightCarId, setRightCarId] = useState<number | null>(2)
  const [leftImageIndex, setLeftImageIndex] = useState(0)
  const [rightImageIndex, setRightImageIndex] = useState(0)

  const leftCar = carDatabase.find((car) => car.id === leftCarId) || null
  const rightCar = carDatabase.find((car) => car.id === rightCarId) || null

  // Handle image navigation
  const nextImage = (side: "left" | "right") => {
    if (side === "left" && leftCar) {
      setLeftImageIndex((prev) => (prev + 1) % leftCar.images.length)
    } else if (side === "right" && rightCar) {
      setRightImageIndex((prev) => (prev + 1) % rightCar.images.length)
    }
  }

  const prevImage = (side: "left" | "right") => {
    if (side === "left" && leftCar) {
      setLeftImageIndex((prev) => (prev - 1 + leftCar.images.length) % leftCar.images.length)
    } else if (side === "right" && rightCar) {
      setRightImageIndex((prev) => (prev - 1 + rightCar.images.length) % rightCar.images.length)
    }
  }

  // Swap cars
  const swapCars = () => {
    const tempLeftId = leftCarId
    setLeftCarId(rightCarId)
    setRightCarId(tempLeftId)
    setLeftImageIndex(0)
    setRightImageIndex(0)
  }

  // Determine if a spec is better (simple comparison for demo purposes)
  const isBetter = (spec: string, value1: any, value2: any): boolean | null => {
    if (value1 === value2) return null

    // For these specs, higher is better
    const higherIsBetter = ["horsepower", "bootCapacity", "fuelEconomy", "groundClearance"]

    // For these specs, lower is better
    const lowerIsBetter = ["weight"]

    // Convert string values to numbers for comparison when possible
    const getValue = (val: any): number => {
      if (typeof val === "number") return val
      if (typeof val === "string") {
        const numMatch = val.match(/(\d+(\.\d+)?)/)
        return numMatch ? Number.parseFloat(numMatch[0]) : 0
      }
      return 0
    }

    const num1 = getValue(value1)
    const num2 = getValue(value2)

    if (higherIsBetter.includes(spec)) {
      return num1 > num2
    } else if (lowerIsBetter.includes(spec)) {
      return num1 < num2
    }

    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Car Comparison</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Car Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select First Car</label>
          <Select value={leftCarId?.toString()} onValueChange={(value) => setLeftCarId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a car" />
            </SelectTrigger>
            <SelectContent>
              {carDatabase.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()}>
                  {car.year} {car.make} {car.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Car Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Second Car</label>
          <Select value={rightCarId?.toString()} onValueChange={(value) => setRightCarId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a car" />
            </SelectTrigger>
            <SelectContent>
              {carDatabase.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()}>
                  {car.year} {car.make} {car.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center mb-6">
        <Button variant="outline" onClick={swapCars}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Swap Cars
        </Button>
      </div>

      {leftCar && rightCar ? (
        <>
          {/* Car Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-2xl font-bold">
                  {leftCar.year} {leftCar.make} {leftCar.model}
                </h2>
                <p className="text-lg">{leftCar.price}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-2xl font-bold">
                  {rightCar.year} {rightCar.make} {rightCar.model}
                </h2>
                <p className="text-lg">{rightCar.price}</p>
              </CardContent>
            </Card>
          </div>

          {/* Car Images with Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <div className="relative h-64 w-full">
                <Image
                  src={leftCar.images[leftImageIndex] || "/placeholder.svg"}
                  alt={`${leftCar.year} ${leftCar.make} ${leftCar.model}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-80"
                  onClick={() => prevImage("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-80"
                  onClick={() => nextImage("left")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {leftCar.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index === leftImageIndex ? "bg-primary" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-64 w-full">
                <Image
                  src={rightCar.images[rightImageIndex] || "/placeholder.svg"}
                  alt={`${rightCar.year} ${rightCar.make} ${rightCar.model}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-80"
                  onClick={() => prevImage("right")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-80"
                  onClick={() => nextImage("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {rightCar.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index === rightImageIndex ? "bg-primary" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Comparison */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Specs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            </TabsList>

            {Object.entries(specCategories).map(([category, specs]) => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Specification</th>
                          <th className="text-left p-4 font-medium">
                            {leftCar.make} {leftCar.model}
                          </th>
                          <th className="text-left p-4 font-medium">
                            {rightCar.make} {rightCar.model}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {specs.map((spec) => {
                          const leftValue = leftCar.specs[spec as keyof typeof leftCar.specs]
                          const rightValue = rightCar.specs[spec as keyof typeof rightCar.specs]
                          const leftIsBetter = isBetter(spec, leftValue, rightValue)
                          const rightIsBetter = isBetter(spec, rightValue, leftValue)

                          return (
                            <tr key={spec} className="border-b last:border-0">
                              <td className="p-4 font-medium">{formatSpecName(spec)}</td>
                              <td
                                className={cn(
                                  "p-4",
                                  leftIsBetter
                                    ? "text-green-600 font-medium"
                                    : leftIsBetter === false
                                      ? "text-muted-foreground"
                                      : "",
                                )}
                              >
                                {leftValue}
                              </td>
                              <td
                                className={cn(
                                  "p-4",
                                  rightIsBetter
                                    ? "text-green-600 font-medium"
                                    : rightIsBetter === false
                                      ? "text-muted-foreground"
                                      : "",
                                )}
                              >
                                {rightValue}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Select two cars to compare their specifications.</p>
        </div>
      )}
    </div>
  )
}
