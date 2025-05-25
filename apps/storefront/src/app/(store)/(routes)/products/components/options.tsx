'use client'

import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export function TextSearchInput({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('')
   const [debouncedValue, setDebouncedValue] = React.useState('')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value.trim())
      }, 300)

      return () => {
         clearTimeout(handler)
      }
   }, [value])

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (debouncedValue) {
         current.set('search', debouncedValue)
      } else {
         current.delete('search')
      }

      // cast to string
      const search = current.toString()
      // or const query = `${'?'.repeat(search.length && 1)}${search}`;
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }, [debouncedValue])

   return (
      <div className="w-full">
         <Input
            type="text"
            placeholder="Search products..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full"
         />
      </div>
   )
}

export function PriceRangeInput({ initialMin, initialMax }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [minPrice, setMinPrice] = React.useState('')
   const [maxPrice, setMaxPrice] = React.useState('')

   useEffect(() => {
      const timeout = setTimeout(() => {
         const current = new URLSearchParams(Array.from(searchParams.entries()))

         if (minPrice) {
            current.set('minPrice', minPrice)
         } else {
            current.delete('minPrice')
         }

         if (maxPrice) {
            current.set('maxPrice', maxPrice)
         } else {
            current.delete('maxPrice')
         }

         const search = current.toString()
         const query = search ? `?${search}` : ''

         router.replace(`${pathname}${query}`, {
            scroll: false,
         })
      }, 300)

      return () => clearTimeout(timeout)
   }, [minPrice, maxPrice])

   useEffect(() => {
      if (isVariableValid(initialMin)) setMinPrice(initialMin)
      if (isVariableValid(initialMax)) setMaxPrice(initialMax)
   }, [initialMin, initialMax])

   return (
      <div className="flex gap-2">
         <Input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
         />
         <Input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
         />
      </div>
   )
}

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('featured')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   return (
      <Select
         onValueChange={(currentValue) => {
            const current = new URLSearchParams(
               Array.from(searchParams.entries())
            )

            if (currentValue === value) {
               current.delete('sort')
               setValue('')
            } else {
               current.set('sort', currentValue)
               setValue(currentValue)
            }

            // cast to string
            const search = current.toString()
            // or const query = `${'?'.repeat(search.length && 1)}${search}`;
            const query = search ? `?${search}` : ''

            router.replace(`${pathname}${query}`, {
               scroll: false,
            })
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            {/* <SelectItem value="featured">Featured</SelectItem> */}
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function CategoriesCombobox({ categories, initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = React.useState(false)
   const [selectedCategories, setSelectedCategories] = React.useState([])

   useEffect(() => {
      if (initialCategory) {
         const initial = Array.isArray(initialCategory)
            ? initialCategory
            : initialCategory.split(',')
         setSelectedCategories(initial)
      }
   }, [initialCategory])

   function toggleCategory(value) {
      setSelectedCategories((prev) =>
         prev.includes(value)
            ? prev.filter((c) => c !== value)
            : [...prev, value]
      )
   }

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (selectedCategories.length > 0) {
         current.set('category', selectedCategories.join(','))
      } else {
         current.delete('category')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }, [selectedCategories])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {selectedCategories.length > 0
                  ? `${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'} selected`
                  : 'Select categories...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search category..." />
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                     {categories.map((category) => (
                        <CommandItem
                           key={category.title}
                           value={category.title}
                           onSelect={() => toggleCategory(category.title)}
                        >
                           <Check
                              className={`mr-2 h-4 w-4 ${
                                 selectedCategories.includes(category.title)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                              }`}
                           />
                           {category.title}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, initialBrand }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   function getBrandTitle() {
      for (const brand of brands) {
         if (slugify(brand.title) === slugify(value)) return brand.title
      }
   }

   useEffect(() => {
      if (isVariableValid(initialBrand)) setValue(initialBrand)
   }, [initialBrand])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getBrandTitle() : 'Select brand...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search brand..." />
               <CommandList>
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                     {brands.map((brand) => (
                        <CommandItem
                           key={brand.title}
                           value={brand.title}
                           onSelect={(currentValue) => {
                              const current = new URLSearchParams(
                                 Array.from(searchParams.entries())
                              )

                              if (currentValue === value) {
                                 current.delete('brand')
                                 setValue('')
                              } else {
                                 current.set('brand', currentValue)
                                 setValue(currentValue)
                              }

                              // cast to string
                              const search = current.toString()
                              // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                              const query = search ? `?${search}` : ''

                              router.replace(`${pathname}${query}`, {
                                 scroll: false,
                              })

                              setOpen(false)
                           }}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4',
                                 value === brand.title
                                    ? 'opacity-100'
                                    : 'opacity-0'
                              )}
                           />
                           {brand.title}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = React.useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   return (
      <div className="flex w-full border rounded-md items-center space-x-2">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={(currentValue: boolean) => {
                  const current = new URLSearchParams(
                     Array.from(searchParams.entries())
                  )

                  current.set(
                     'isAvailable',
                     currentValue == true ? 'true' : 'false'
                  )
                  setValue(currentValue)

                  // cast to string
                  const search = current.toString()
                  // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                  const query = search ? `?${search}` : ''

                  router.replace(`${pathname}${query}`, {
                     scroll: false,
                  })
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}
