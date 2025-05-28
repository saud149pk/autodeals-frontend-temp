'use client';
import { Message, useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Loader2, Send } from 'lucide-react';
import CarCard from '@/components/car-card';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { CarFilters } from '@/components/car-filters';
import Modal from '@/components/ui/modal';
import { useAppStore } from '@/components/state-store';
import apiPrivate from '../api/config/api_private';
import { GET_ALL_CHATS_HISTORY } from '../api/config/API_Endpoints';
import { nanoid } from 'nanoid';
import { processQuestion } from '@/lib/processQuestion';

// Sample car recommendations data
const sampleCarRecommendations = [
  {
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2023,
    price: '$32,000',
    image: '/placeholder.svg?height=192&width=384',
    features: ['Hybrid', 'AWD', 'Safety Sense 2.0'],
    mpg: '41 city / 38 hwy',
    horsepower: 219,
    exteriorColor: 'Blueprint',
    interiorColor: 'Black SofTex',
    engine: '2.5L Hybrid',
    driveTrain: 'Electronic On-Demand AWD',
    description:
      "The Toyota RAV4 Hybrid combines versatility, efficiency, and technology in a stylish package. With standard all-wheel drive and Toyota Safety Sense 2.0, it's designed for both adventure and everyday driving.",
  },
  {
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: '$28,500',
    image: '/placeholder.svg?height=192&width=384',
    features: ['Spacious', 'Reliable', 'Fuel Efficient'],
    mpg: '28 city / 34 hwy',
    horsepower: 190,
    exteriorColor: 'Platinum White Pearl',
    interiorColor: 'Gray Leather',
    engine: '1.5L Turbocharged 4-Cylinder',
    driveTrain: 'Real Time AWD',
    description:
      "The Honda CR-V offers exceptional versatility with its spacious interior and configurable cargo area. Known for reliability and resale value, it's a smart choice for families.",
  },
  {
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    price: '$26,700',
    image: '/placeholder.svg?height=192&width=384',
    features: ['Sporty', 'Premium Feel', 'Good Handling'],
    mpg: '24 city / 30 hwy',
    horsepower: 187,
    exteriorColor: 'Soul Red Crystal Metallic',
    interiorColor: 'Parchment Leather',
    engine: '2.5L 4-Cylinder',
    driveTrain: 'i-ACTIV AWD',
    description:
      'The Mazda CX-5 stands out with its upscale interior and engaging driving dynamics. It offers a premium experience at a mainstream price point with refined handling and responsive steering.',
  },
];

// Sample conversation
const placeholderConversation = [
  {
    id: 'user-1',
    role: 'user',
    content: "I'm looking for a family SUV with good fuel economy.",
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    content:
      "I'd be happy to help you find a family SUV with good fuel economy! To narrow down the options, could you tell me what your budget range is for this vehicle?",
  },
  {
    id: 'user-2',
    role: 'user',
    content: "I'm looking to spend between $25,000 and $35,000.",
  },
  {
    id: 'assistant-2',
    role: 'assistant',
    content:
      "Great! That's a good budget range for many family SUVs. Do you have any specific preferences regarding size? Are you looking for a compact, mid-size, or full-size SUV?",
  },
  {
    id: 'user-3',
    role: 'user',
    content:
      "I think a compact to mid-size would be best. We have two kids but don't need anything too large.",
  },
  {
    id: 'assistant-3',
    role: 'assistant',
    content:
      'Perfect! Compact to mid-size SUVs are popular for families like yours. Are there any specific features that are important to you? For example, all-wheel drive, advanced safety features, third-row seating, or specific technology features?',
  },
  {
    id: 'user-4',
    role: 'user',
    content:
      "Safety features are definitely important. I'd also like good cargo space and maybe a hybrid option for better fuel economy.",
  },
  {
    id: 'assistant-4',
    role: 'assistant',
    content:
      'Based on your preferences for a family-friendly compact to mid-size SUV with good fuel economy in the $25,000-$35,000 range, with an emphasis on safety features, cargo space, and hybrid options, here are three excellent choices that would be perfect for your needs:\n\nCAR_RECOMMENDATIONS:' +
      JSON.stringify(sampleCarRecommendations),
  },
];

export default function CarChatPage() {
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
  const isLogin = localStorage.getItem('user') !== null;

  const router = useRouter();
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    userData,
    setCurrentChatId,
    setIsNewChat,
    chats,
    isNewChat,
    resetChats,
    addChat,
    addToChatHistory,
    currentChatId,
    updateLastChatAnswer,
    processing,
  } = useAppStore();

  useLayoutEffect(() => {
    if (!isLogin) {
      router.push('/login');
      setLoading(false);
    } else {
      const localUserD = localStorage.getItem('user');
      const userD = JSON.parse(localUserD as string);
      useAppStore.getState().setUserData({ ...userD });
      setLoading(false);
      const EXPIRATION_TIMESTAMP = userD.exp * 1000;
      const now = Date.now();

      if (EXPIRATION_TIMESTAMP <= now) {
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        // Set timeout to expire at exact time
        const timeout = setTimeout(() => {
          localStorage.removeItem('user');
          router.push('/login');
        }, EXPIRATION_TIMESTAMP - now);

        // Cleanup if component unmounts
        return () => clearTimeout(timeout);
      }
    }
  }, [router, isLogin]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // Set placeholder conversation on initial load
  // useEffect(() => {
  //   if (messages.length === 0 && showPlaceholder) {
  //     setMessages(placeholderConversation as Message[]);
  //   }
  // }, [messages.length, setMessages, showPlaceholder]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsNewChat(true);
    // setMessages([]);
    // setShowPlaceholder(false);
    // router.refresh();
  };

  useEffect(() => {
    if (isNewChat) {
      const newId = nanoid();
      setCurrentChatId(newId);
      resetChats();
    }
  }, [isNewChat]);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = message.trim();
    if (!question.length) return;

    // Add user's question
    addChat({ question, answer: '' });
    setMessage('');
    setIsTyping(true);

    try {
      const res = await processQuestion({
        chat_id: currentChatId!,
        question,
      });

      updateLastChatAnswer(res.answer);

      // Update chat history
      addToChatHistory({
        chat_id: currentChatId!,
        header: question,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error processing question:', err);
      updateLastChatAnswer('Something went wrong. Please try again.');
      // addChat({ question, answer: 'Something went wrong. Please try again.' });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-4xl mx-auto p-4">
      {loading ||
        (processing && (
          <div className="flex flex-1 items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading conversation...</span>
          </div>
        ))}
      {/* Car Filters */}
      {!loading && !processing && (
        <>
          <CarFilters />

          <div
            className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border"
            ref={chatContainerRef}
          >
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>

            {chats.length === 0 && !showPlaceholder && (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2">
                  Welcome to Car Finder
                </h2>
                <p className="text-gray-500 mb-4">
                  Tell me what kind of car you're looking for, and I'll help you
                  find the perfect match.
                </p>
                <p className="text-gray-500">
                  Try saying: "I need a family SUV with good fuel economy" or "I
                  want a sporty car under $40,000"
                </p>
              </div>
            )}

            {chats.map((message, index) => {
              // Check if the message contains car recommendations
              // no logic yet

              // Regular message display
              return (
                <div key={index}>
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-primary text-primary-foreground">
                      {message.question}
                    </div>
                  </div>

                  {/* Assistant Answer */}
                  {message.answer && (
                    <div className="flex justify-start mt-2">
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                        {message.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the car you're looking for..."
              className="flex-1"
            />
            <Button type="submit" disabled={isTyping || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
