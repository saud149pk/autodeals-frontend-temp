"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, BarChart2, Phone } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

interface CarDetailsModalProps {
  car: {
    make: string
    model: string
    year: number
    price: string
    image?: string
    features?: string[]
    mpg?: string
    horsepower?: number
    exteriorColor?: string
    interiorColor?: string
    engine?: string
    driveTrain?: string
    description?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function CarDetailsModal({ car, isOpen, onClose }: CarDetailsModalProps) {
  // Default values for missing properties
  const carDetails = {
    exteriorColor: car.exteriorColor || "Cosmic Silver",
    interiorColor: car.interiorColor || "Black Leather",
    engine: car.engine || (car.horsepower ? `${car.horsepower} HP Engine` : "2.5L 4-Cylinder"),
    driveTrain: car.driveTrain || "All-Wheel Drive",
    description:
      car.description ||
      `The ${car.year} ${car.make} ${car.model} combines style, performance, and reliability in one impressive package. With its sleek design and advanced features, this vehicle offers an exceptional driving experience for both daily commutes and weekend adventures.`,
    features: car.features || [
      "Bluetooth Connectivity",
      "Backup Camera",
      "Lane Departure Warning",
      "Adaptive Cruise Control",
      "Heated Seats",
      "Sunroof",
      "Navigation System",
      "Premium Audio",
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl">
              {car.year} {car.make} {car.model}
            </DialogTitle>
            <DialogDescription className="text-lg font-medium">{car.price}</DialogDescription>
          </div>
          {/* Removed the duplicate close button */}
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Car Image */}
          <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image
              src={car.image || `/placeholder.svg?height=300&width=500`}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Car Specifications */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Exterior Color</h4>
                <p>{carDetails.exteriorColor}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Interior Color</h4>
                <p>{carDetails.interiorColor}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Engine</h4>
                <p>{carDetails.engine}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Drive Train</h4>
                <p>{carDetails.driveTrain}</p>
              </div>
              {car.mpg && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fuel Economy</h4>
                  <p>{car.mpg}</p>
                </div>
              )}
              {car.horsepower && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Horsepower</h4>
                  <p>{car.horsepower} HP</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Dealer Info
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1">
                <BarChart2 className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{carDetails.description}</p>
        </div>

        {/* Features */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <div className="flex flex-wrap gap-2">
            {carDetails.features.map((feature, index) => (
              <Badge key={index} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
