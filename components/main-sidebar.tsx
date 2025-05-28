'use client';

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
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message, useChat } from 'ai/react';
import { useAppStore } from './state-store';
import apiPrivate from '@/app/api/config/api_private';
import { GET_ALL_CHATS_HISTORY } from '@/app/api/config/API_Endpoints';
import useSWR from 'swr';
import axios from 'axios';
import { groupChatsByDate } from '@/hooks/groupChatsByDate';
import { fetchSingleChat } from '@/lib/singleChat';
import { Loader2 } from 'lucide-react';

// Improved chat history with better date grouping
// const chatHistory = [
//   {
//     id: 'chat-1',
//     title: 'Family SUV with good mileage',
//     date: 'Today',
//     time: '10:30 AM',
//     isActive: true,
//   },
//   {
//     id: 'chat-2',
//     title: 'Sports car under $50k',
//     date: 'Today',
//     time: '3:15 PM',
//   },
//   {
//     id: 'chat-3',
//     title: 'Electric vehicles with long range',
//     date: 'Yesterday',
//     time: '11:45 AM',
//   },
//   {
//     id: 'chat-4',
//     title: 'Luxury sedans comparison',
//     date: 'Yesterday',
//     time: '2:20 PM',
//   },
//   {
//     id: 'chat-5',
//     title: 'Compact cars for city driving',
//     date: 'Apr 18, 2023',
//     time: '9:05 AM',
//   },
//   {
//     id: 'chat-6',
//     title: 'Best trucks for towing',
//     date: 'Apr 15, 2023',
//     time: '4:30 PM',
//   },
//   {
//     id: 'chat-7',
//     title: 'Convertibles for summer',
//     date: 'Apr 10, 2023',
//     time: '1:15 PM',
//   },
// ];

// Group chats by date
// const groupChatsByDate = (chats) => {
//   const groups = {};

//   chats.forEach((chat) => {
//     if (!groups[chat.date]) {
//       groups[chat.date] = [];
//     }
//     groups[chat.date].push(chat);
//   });

//   return Object.entries(groups);
// };

const fetcher = (url: string) => apiPrivate.get(url).then((res) => res.data);

export function MainSidebar() {
  const router = useRouter();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const {
    userData,
    setChatHistory,
    chatHistory,
    currentChatId,
    setCurrentChatId,
    setIsNewChat,
    setChats,
    processing,
    setProcessing,
  } = useAppStore();
  const userId = userData?.user_id;

  // const {
  //   messages,
  //   input,
  //   handleInputChange,
  //   handleSubmit,
  //   isLoading,
  //   setMessages,
  // } = useChat({
  //   api: '/api/car-chat',
  // });

  const { data, error, isLoading } = useSWR(
    userId ? `/get-user-history` : null,
    fetcher,
    {
      onSuccess: (data) => {
        setChatHistory(data.chats);
      },
    }
  );

  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsNewChat(true);
    // setMessages([]);
    // router.refresh();
    // router.push("/?new=true")
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // const groupedChats = groupChatsByDate(chatHistory);
  const groupedChats = groupChatsByDate(chatHistory);

  useEffect(() => {
    console.log(groupedChats);
  }, [chatHistory]);

  const handleChatSelect = async (chat_id: string) => {
    if (chat_id === currentChatId) return;
    setProcessing(true);

    setCurrentChatId(chat_id);
    setIsNewChat(false);

    try {
      const chatData = await fetchSingleChat(chat_id);
      const conversations = chatData.conversations || [];

      // set chats to zustand
      setChats(conversations);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.error('Failed to load chat:', err);
    }
  };

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
            {/* {groupedChats.map(([date, chats]) => ( */}
            {isLoading && (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Loading chat history...</span>
              </div>
            )}
            {!isLoading &&
              Object.entries(groupedChats).map(([group, chats]) =>
                chats.length > 0 ? (
                  <div key={group} className="mb-2">
                    <div key={group}>
                      <div className="px-4 py-1 text-xs font-medium text-muted-foreground">
                        {group}
                      </div>
                      <div className="space-y-1">
                        {chats.map((chat) => (
                          <div
                            key={chat.chat_id}
                            className={cn(
                              'relative px-2 transition-colors duration-200 ease-in-out rounded-md',
                              'ring-0 outline-none',
                              'focus:outline-none focus:ring-0',
                              hoveredChat === chat.chat_id && 'bg-accent/80',
                              currentChatId === chat.chat_id && 'bg-accent'
                            )}
                            onMouseEnter={() => setHoveredChat(chat.chat_id)}
                            onMouseLeave={() => setHoveredChat(null)}
                          >
                            <Button
                              key={chat.chat_id}
                              variant="ghost"
                              className={cn(
                                'flex items-center py-2 px-2',
                                'ring-0 outline-none',
                                'focus:outline-none focus:ring-0'
                              )}
                              onClick={() => {
                                handleChatSelect(chat.chat_id);
                              }}
                            >
                              {chat.header.length > 30
                                ? chat.header.slice(0, 27) + '...'
                                : chat.header}
                              {/* <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {chat.header}
                              </div>
                            </div> */}

                              {/* Always render the button but control its opacity for smooth transitions */}
                              <div
                                className={cn(
                                  'transition-opacity duration-200 ease-in-out ml-2',
                                  'ring-0 outline-none',
                                  'focus:outline-none focus:ring-0',
                                  hoveredChat === chat.chat_id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <a
                                      // variant="ghost"
                                      // size="icon"

                                      className="h-7 w-7 p-0 ring-0 outline-none focus:outline-none focus:ring-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        More options
                                      </span>
                                    </a>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-[160px]"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log(
                                          'Rename chat',
                                          chat.chat_id
                                        );
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Rename</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Share chat', chat.chat_id);
                                      }}
                                    >
                                      <Share className="mr-2 h-4 w-4" />
                                      <span>Share</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log(
                                          'Archive chat',
                                          chat.chat_id
                                        );
                                      }}
                                    >
                                      <Archive className="mr-2 h-4 w-4" />
                                      <span>Archive</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log(
                                          'Delete chat',
                                          chat.chat_id
                                        );
                                      }}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
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
  );
}
