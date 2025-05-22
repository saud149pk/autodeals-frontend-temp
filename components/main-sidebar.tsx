"use client"

import {
  Car,
  Home,
  Plus,
  Trash,
  MoreHorizontal,
  Pencil,
  Share,
  Archive,
  Warehouse,
  BarChart2,
  Heart,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Improved chat history with better date grouping
const chatHistory = [
  { id: "chat-1", title: "Family SUV with good mileage", date: "Today", time: "10:30 AM", isActive: true },
  { id: "chat-2", title: "Sports car under $50k", date: "Today", time: "3:15 PM" },
  { id: "chat-3", title: "Electric vehicles with long range", date: "Yesterday", time: "11:45 AM" },
  { id: "chat-4", title: "Luxury sedans comparison", date: "Yesterday", time: "2:20 PM" },
  { id: "chat-5", title: "Compact cars for city driving", date: "Apr 18, 2023", time: "9:05 AM" },
  { id: "chat-6", title: "Best trucks for towing", date: "Apr 15, 2023", time: "4:30 PM" },
  { id: "chat-7", title: "Convertibles for summer", date: "Apr 10, 2023", time: "1:15 PM" },
]

// Group chats by date
const groupChatsByDate = (chats) => {
  const groups = {}

  chats.forEach((chat) => {
    if (!groups[chat.date]) {
      groups[chat.date] = []
    }
    groups[chat.date].push(chat)
  })

  return Object.entries(groups)
}

export function MainSidebar() {
  const router = useRouter()
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)

  const handleNewChat = () => {
    router.push("/?new=true")
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const groupedChats = groupChatsByDate(chatHistory)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <Car className="h-6 w-6" />
          <h1 className="text-xl font-bold">Car Finder</h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <Home />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/garage">
                    <Warehouse />
                    <span>My Garage</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/comparison">
                    <BarChart2 />
                    <span>Comparison</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/wishlist">
                    <Heart />
                    <span>Wishlist</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent className="px-0">
            {groupedChats.map(([date, chats]) => (
              <div key={date} className="mb-2">
                <div className="px-4 py-1 text-xs font-medium text-muted-foreground">{date}</div>
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "relative px-2 transition-colors duration-200 ease-in-out rounded-md",
                        hoveredChat === chat.id && "bg-accent/80",
                        chat.isActive && "bg-accent",
                      )}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      <a href={`/chat/${chat.id}`} className="flex items-center py-2 px-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{chat.title}</div>
                        </div>

                        {/* Always render the button but control its opacity for smooth transitions */}
                        <div
                          className={cn(
                            "transition-opacity duration-200 ease-in-out ml-2",
                            hoveredChat === chat.id ? "opacity-100" : "opacity-0",
                          )}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  console.log("Rename chat", chat.id)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  console.log("Share chat", chat.id)
                                }}
                              >
                                <Share className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  console.log("Archive chat", chat.id)
                                }}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Archive</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.preventDefault()
                                  console.log("Delete chat", chat.id)
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-2">
        <Button className="w-full" variant="default" onClick={handleNewChat}>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <Button className="w-full" variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
