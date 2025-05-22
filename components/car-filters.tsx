"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function CarFilters() {
  const [expanded, setExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  return (
    <div className="bg-background border rounded-lg mb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span className="font-medium">Filters</span>
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 w-8 p-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className={cn("px-3 pb-3 grid gap-4", expanded ? "grid-cols-1 md:grid-cols-4" : "hidden")}>
        {/* Vehicle Type */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Vehicle Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Price Range</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="under-20k">Under $20,000</SelectItem>
              <SelectItem value="20k-30k">$20,000 - $30,000</SelectItem>
              <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
              <SelectItem value="50k-80k">$50,000 - $80,000</SelectItem>
              <SelectItem value="over-80k">Over $80,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Make */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Make</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="chevrolet">Chevrolet</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="tesla">Tesla</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Year</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Year</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="older">2018 & Older</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="md:col-span-4">
          <label className="text-sm font-medium mb-1.5 block">Features</label>
          <div className="flex flex-wrap gap-2">
            {["Hybrid", "Electric", "AWD", "Leather Seats", "Sunroof", "Navigation", "Bluetooth", "Backup Camera"].map(
              (feature) => (
                <Badge
                  key={feature}
                  variant={activeFilters.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter(feature)}
                >
                  {feature}
                  {activeFilters.includes(feature) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ),
            )}
          </div>
        </div>

        {/* MPG Range */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Fuel Economy (MPG)</label>
          <div className="px-2">
            <Slider defaultValue={[0, 50]} min={0} max={50} step={1} />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0</span>
              <span>50+</span>
            </div>
          </div>
        </div>

        {/* Horsepower Range */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Horsepower</label>
          <div className="px-2">
            <Slider defaultValue={[0, 500]} min={0} max={500} step={10} />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0</span>
              <span>500+</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-4 flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm">
            Reset
          </Button>
          <Button size="sm">Apply Filters</Button>
        </div>
      </div>
    </div>
  )
}
