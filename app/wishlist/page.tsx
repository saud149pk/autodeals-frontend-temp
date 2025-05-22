"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash, ArrowRight, BarChart2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample wishlist data
const initialWishlistCars = [
  {
    id: 1,
    make: "Audi",
    model: "Q5",
    year: 2023,
    price: "$43,500",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Quattro AWD", "Virtual Cockpit", "Premium Audio"],
    mpg: "23 city / 28 hwy",
    horsepower: 261,
  },
  {
    id: 2,
    make: "Lexus",
    model: "ES 350",
    year: 2023,
    price: "$42,490",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Luxury", "Safety System+", "Mark Levinson Audio"],
    mpg: "22 city / 32 hwy",
    horsepower: 302,
  },
  {
    id: 3,
    make: "Porsche",
    model: "Macan",
    year: 2023,
    price: "$57,500",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Sport Chrono", "PASM", "Premium Package"],
    mpg: "19 city / 25 hwy",
    horsepower: 348,
  },
  {
    id: 4,
    make: "Volvo",
    model: "XC60",
    year: 2023,
    price: "$43,450",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Pilot Assist", "Bowers & Wilkins", "Air Suspension"],
    mpg: "22 city / 28 hwy",
    horsepower: 295,
  },
]

export default function WishlistPage() {
  const [wishlistCars, setWishlistCars] = useState(initialWishlistCars)
  const router = useRouter()

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistCars(wishlistCars.filter((car) => car.id !== id))
  }

  const handleCompare = (carId: number) => {
    // Navigate to comparison page with this car pre-selected
    router.push(`/comparison?car=${carId}`)
  }

  const handleAddToGarage = (carId: number) => {
    // In a real app, this would add the car to the user's garage
    // For now, we'll just show an alert
    alert(`Car ${carId} added to garage!`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        {wishlistCars.length > 1 && (
          <Button onClick={() => router.push("/comparison")}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Compare All
          </Button>
        )}
      </div>

      {wishlistCars.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save cars you're interested in to compare them later or keep track of price changes.
          </p>
          <Button onClick={() => router.push("/")}>Start Browsing Cars</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistCars.map((car) => (
            <Card key={car.id} className="overflow-hidden group">
              <div className="relative h-48 w-full">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromWishlist(car.id)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
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
                  <div>
                    <span className="text-gray-500">MPG:</span> {car.mpg}
                  </div>
                  <div>
                    <span className="text-gray-500">HP:</span> {car.horsepower}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => handleCompare(car.id)}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Compare
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddToGarage(car.id)}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Add to Garage
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
