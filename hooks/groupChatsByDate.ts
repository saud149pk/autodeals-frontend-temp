// utils/groupChatsByDate.ts
interface ChatSummary {
  chat_id: string;
  header: string;
  timestamp: number;
}

export function groupChatsByDate(chats: ChatSummary[]) {
  const groups: Record<string, ChatSummary[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  for (const chat of chats) {
    const chatDate = new Date(chat.timestamp);

    if (chatDate >= today) {
      groups['Today'].push(chat);
    } else if (chatDate >= yesterday) {
      groups['Yesterday'].push(chat);
    } else if (chatDate >= oneWeekAgo) {
      groups['This Week'].push(chat);
    } else if (chatDate >= oneMonthAgo) {
      groups['This Month'].push(chat);
    } else {
      groups['Older'].push(chat);
    }
  }

  // Sort each group by most recent
  for (const group in groups) {
    groups[group].sort((a, b) => b.timestamp - a.timestamp);
  }

  return groups;
}
