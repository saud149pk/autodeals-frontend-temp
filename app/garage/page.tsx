"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Upload, Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample car makes for the dropdown
const carMakes = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

// Sample data for previously added cars
const sampleCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: "$25,000",
    purchaseDate: new Date(2020, 5, 15),
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    make: "Honda",
    model: "Accord",
    year: 2021,
    price: "$28,500",
    purchaseDate: new Date(2021, 2, 10),
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: "$45,000",
    purchaseDate: new Date(2022, 8, 5),
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function GaragePage() {
  const [cars, setCars] = useState(sampleCars)
  const [date, setDate] = useState<Date>()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    price: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleMakeChange = (value: string) => {
    setFormData({
      ...formData,
      make: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just use a placeholder
      setSelectedImage("/placeholder.svg?height=200&width=300")
    }
  }

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new car object
    const newCar = {
      id: cars.length + 1,
      make: formData.make,
      model: formData.model,
      year: Number.parseInt(formData.year),
      price: formData.price.startsWith("$") ? formData.price : `$${formData.price}`,
      purchaseDate: date || new Date(),
      image: selectedImage || "/placeholder.svg?height=200&width=300",
    }

    // Add the new car to the list
    setCars([...cars, newCar])

    // Reset the form
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      price: "",
    })
    setDate(undefined)
    setSelectedImage(null)
  }

  const handleDeleteCar = (id: number) => {
    setCars(cars.filter((car) => car.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">My Garage</h1>

      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cars">My Cars</TabsTrigger>
          <TabsTrigger value="add">Add New Car</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          {cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any cars to your garage yet.</p>
              <Button onClick={() => document.querySelector('[data-value="add"]')?.click()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Car
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <CardDescription>{car.price}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm text-muted-foreground">Purchased on {format(car.purchaseDate, "PPP")}</div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Car</CardTitle>
              <CardDescription>Enter the details of your car to add it to your garage.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Select value={formData.make} onValueChange={handleMakeChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {carMakes.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Camry, Model 3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2023"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 25000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Car Image</Label>
                    <div className="flex items-center gap-4">
                      <Label
                        htmlFor="image-upload"
                        className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Label>
                      {selectedImage && <span className="text-sm text-muted-foreground">Image selected</span>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Car to Garage
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
