"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import Image from "next/image"
import { CarDetailsModal } from "./car-details-modal"

interface CarCardProps {
  car: {
    make: string
    model: string
    year: number
    price: string
    image: string
    features: string[]
    mpg?: string
    horsepower?: number
    exteriorColor?: string
    interiorColor?: string
    engine?: string
    driveTrain?: string
    description?: string
  }
}

export default function CarCard({ car }: CarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48 w-full">
          <Image
            src={car.image || `/placeholder.svg?height=192&width=384`}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation() // Prevent card click from triggering
              console.log("Add to favorites")
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">
            {car.year} {car.make} {car.model}
          </CardTitle>
          <CardDescription>{car.price}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-1 mb-2">
            {car.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {car.mpg && (
              <div>
                <span className="text-gray-500">MPG:</span> {car.mpg}
              </div>
            )}
            {car.horsepower && (
              <div>
                <span className="text-gray-500">HP:</span> {car.horsepower}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full text-sm">
            View Details
          </Button>
        </CardFooter>
      </Card>

      <CarDetailsModal car={car} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
