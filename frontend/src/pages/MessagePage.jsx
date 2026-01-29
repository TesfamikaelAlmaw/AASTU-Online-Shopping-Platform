import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Paperclip,
  Send,
  Star,
  StarOff,
  Reply,
  Trash2,
  Smile,
} from "lucide-react";
import chatService from "../services/chat.service";
import authService from "../services/auth.service";

const REACTIONS = ["👍", "❤️", "😂", "🎉", "😮", "😢"];

function MessagePage({ initialChatId = null }) {
  const currentUser = authService.getCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [messageText, setMessageText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [typingState, setTypingState] = useState({});
  const [onlineState, setOnlineState] = useState({});
  const [activeReactionMessage, setActiveReactionMessage] = useState(null);
  const [sharedMedia, setSharedMedia] = useState([]);
  const [activeMediaTab, setActiveMediaTab] = useState("images");
  const [socketReady, setSocketReady] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [hasLoadedChats, setHasLoadedChats] = useState(false);
  const socketRef = useRef(null);
  const selectedChatIdRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);

  const lastChatStorageKey = currentUser?._id
    ? `lastChatId:${currentUser._id}`
    : "lastChatId";

  const urlChatId = searchParams.get("chatId");

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const renderAvatar = (user, sizeClass = "w-12 h-12") => {
    if (user?.profile_image) {
      return (
        <img
          src={user.profile_image}
          alt={user.full_name || "User"}
          className={`${sizeClass} rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold`}
      >
        {getInitials(user?.full_name)}
      </div>
    );
  };

  const dedupedChats = useMemo(() => {
    const map = new Map();
    chats.forEach((chat) => {
      const other = chat.participants?.find(
        (user) => user._id !== currentUser?._id,
      );
      const key = other?._id || chat._id;
      if (!map.has(key)) {
        map.set(key, chat);
        return;
      }
      const existing = map.get(key);
      const existingTime = existing?.lastMessageAt
        ? new Date(existing.lastMessageAt).getTime()
        : 0;
      const currentTime = chat.lastMessageAt
        ? new Date(chat.lastMessageAt).getTime()
        : 0;
      if (currentTime >= existingTime) {
        map.set(key, chat);
      }
    });
    return Array.from(map.values());
  }, [chats, currentUser]);

  const selectedChat = useMemo(
    () => dedupedChats.find((chat) => chat._id === selectedChatId),
    [dedupedChats, selectedChatId],
  );

  const filteredChats = useMemo(() => {
    const term = chatSearch.trim().toLowerCase();
    if (!term) return dedupedChats;
    return dedupedChats.filter((chat) => {
      const participant = chat.participants?.find(
        (user) => user._id !== currentUser?._id,
      );
      const name = participant?.full_name?.toLowerCase() || "";
      const email = participant?.email?.toLowerCase() || "";
      return name.includes(term) || email.includes(term);
    });
  }, [dedupedChats, chatSearch, currentUser]);

  const activeMessages = messagesByChat[selectedChatId] || [];

  const otherUser = useMemo(() => {
    if (!selectedChat || !currentUser) return null;
    return selectedChat.participants?.find(
      (user) => user._id !== currentUser._id,
    );
  }, [selectedChat, currentUser]);

  useEffect(() => {
    if (initialChatId) {
      setSelectedChatId(initialChatId);
      localStorage.setItem(lastChatStorageKey, initialChatId);
      setSearchParams({ chatId: initialChatId });
      return;
    }

    if (urlChatId) {
      setSelectedChatId(urlChatId);
      localStorage.setItem(lastChatStorageKey, urlChatId);
      return;
    }

    const savedChatId = localStorage.getItem(lastChatStorageKey);
    if (savedChatId) {
      setSelectedChatId(savedChatId);
      setSearchParams({ chatId: savedChatId });
    }
  }, [initialChatId, lastChatStorageKey, urlChatId, setSearchParams]);

  useEffect(() => {
    chatService.getChats().then((data) => {
      setChats(data);
      setHasLoadedChats(true);

      if (initialChatId || selectedChatId) {
        return;
      }

      const savedChatId = localStorage.getItem(lastChatStorageKey);
      if (savedChatId) {
        setSelectedChatId(savedChatId);
        return;
      }

      if (data.length > 0) {
        setSelectedChatId(data[0]._id);
        localStorage.setItem(lastChatStorageKey, data[0]._id);
      }
    });
  }, [initialChatId, lastChatStorageKey, selectedChatId]);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    const socket = chatService.connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketReady(true);
      if (selectedChatIdRef.current) {
        socket.emit("joinChat", { chatId: selectedChatIdRef.current });
      }
    });

    socket.on("disconnect", () => {
      setSocketReady(false);
    });

    socket.on("presence", ({ userId, status }) => {
      if (userId === currentUser?._id) return;
      setOnlineState((prev) => ({ ...prev, [userId]: status === "online" }));
    });

    socket.on("typing", ({ chatId, userId, isTyping }) => {
      setTypingState((prev) => ({
        ...prev,
        [chatId]: { ...(prev[chatId] || {}), [userId]: isTyping },
      }));
    });

    socket.on("message:new", ({ chatId, message }) => {
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id !== chatId) return chat;
          const isActive = chatId === selectedChatIdRef.current;
          const isMine = message.sender?._id === currentUser?._id;
          const unreadCount =
            isActive || isMine ? 0 : (chat.unreadCount || 0) + 1;
          return {
            ...chat,
            lastMessageText: message.text || "Attachment",
            lastMessageAt: message.createdAt,
            unreadCount,
          };
        }),
      );

      if (
        chatId === selectedChatIdRef.current &&
        message.sender?._id !== currentUser?._id
      ) {
        socket.emit("readMessages", { chatId });
      }
    });

    socket.on("message:reaction", ({ message }) => {
      const chatId = message.chat;
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map((msg) =>
          msg._id === message._id ? message : msg,
        ),
      }));
    });

    socket.on("message:deleted", ({ messageId, scope, userId }) => {
      setMessagesByChat((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((chatId) => {
          updated[chatId] = (updated[chatId] || [])
            .filter((msg) => {
              if (msg._id !== messageId) return true;
              if (scope === "everyone") return true;
              return userId !== currentUser?._id;
            })
            .map((msg) => {
              if (msg._id !== messageId) return msg;
              if (scope === "everyone") {
                return { ...msg, deletedForEveryone: true };
              }
              return msg;
            });
        });
        return updated;
      });
    });

    socket.on("message:read", ({ chatId, userId }) => {
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map((msg) => {
          if (msg.sender?._id !== currentUser?._id) return msg;
          const readBy = msg.readBy || [];
          if (readBy.includes(userId)) return msg;
          return { ...msg, readBy: [...readBy, userId] };
        }),
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("presence");
      socket.off("typing");
      socket.off("message:new");
      socket.off("message:reaction");
      socket.off("message:deleted");
      socket.off("message:read");
    };
  }, [currentUser]);

  useEffect(() => {
    if (!selectedChatId || !socketReady) return;
    const socket = socketRef.current;
    socket?.emit("joinChat", { chatId: selectedChatId });

    let active = true;
    chatService.getMessages(selectedChatId).then((data) => {
      if (!active) return;
      setMessagesByChat((prev) => ({
        ...prev,
        [selectedChatId]: data.reverse(),
      }));
      chatService.markRead(selectedChatId);
    });

    chatService.getSharedMedia(selectedChatId).then((data) => {
      if (!active) return;
      setSharedMedia(data);
    });

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedChatId ? { ...chat, unreadCount: 0 } : chat,
      ),
    );

    return () => {
      active = false;
      socket?.emit("leaveChat", { chatId: selectedChatId });
    };
  }, [selectedChatId, socketReady]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  useEffect(() => {
    if (hasLoadedChats && !selectedChatId && dedupedChats.length > 0) {
      setShowChatList(true);
    }
  }, [hasLoadedChats, selectedChatId, dedupedChats.length]);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    localStorage.setItem(lastChatStorageKey, chatId);
    setSearchParams({ chatId });
    setReplyTo(null);
  };

  const handleTyping = (value) => {
    setMessageText(value);
    if (!selectedChatId) return;
    const socket = socketRef.current;
    socket?.emit("typing", { chatId: selectedChatId, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing", { chatId: selectedChatId, isTyping: false });
    }, 800);
  };

  const handleAddFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const enriched = files.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}`,
      preview: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...enriched]);
  };

  const handleRemoveFile = (id) => {
    setPendingFiles((prev) => {
      const toRemove = prev.find((item) => item.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedChatId) return;

    const trimmed = messageText.trim();
    if (!trimmed && pendingFiles.length === 0) return;

    let attachments = [];
    if (pendingFiles.length > 0) {
      const uploads = await Promise.all(
        pendingFiles.map((item) => chatService.uploadAttachment(item.file)),
      );
      attachments = uploads;
      pendingFiles.forEach((item) => URL.revokeObjectURL(item.preview));
      setPendingFiles([]);
    }

    const payload = {
      text: trimmed,
      attachments,
      replyTo: replyTo?._id,
    };

    const socket = socketRef.current;
    socket?.emit("sendMessage", { chatId: selectedChatId, ...payload });
    setMessageText("");
    setReplyTo(null);
  };

  const handleReaction = (messageId, emoji) => {
    socketRef.current?.emit("reaction", { messageId, emoji });
    setActiveReactionMessage(null);
  };

  const handleDelete = (messageId, scope) => {
    socketRef.current?.emit("deleteMessage", { messageId, scope });
  };

  const handleToggleFavorite = async (chatId, isFavorite) => {
    await chatService.toggleFavorite(chatId, isFavorite);
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId ? { ...chat, isFavorite } : chat,
      ),
    );
  };

  const renderTextWithLinks = (text) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    return text.split(regex).map((part, index) => {
      if (part.match(regex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const typingUsers = useMemo(() => {
    if (!selectedChatId) return [];
    const typing = typingState[selectedChatId] || {};
    return Object.entries(typing)
      .filter(([userId, isTyping]) => userId !== currentUser?._id && isTyping)
      .map(([userId]) => userId);
  }, [typingState, selectedChatId, currentUser]);

  const mediaByType = useMemo(() => {
    const images = [];
    const files = [];
    const audio = [];
    const links = [];

    sharedMedia.forEach((message) => {
      (message.attachments || []).forEach((att) => {
        if (att.type?.startsWith("image")) images.push(att);
        else if (att.type?.startsWith("audio")) audio.push(att);
        else files.push(att);
      });

      const matches = (message.text || "").match(/https?:\/\/[^\s]+/g);
      if (matches) links.push(...matches);
    });

    return { images, files, audio, links };
  }, [sharedMedia]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-2xl font-bold mb-6">Messages</div>
      <div className="grid grid-cols-[1fr_320px] gap-4">
        <section className="bg-white rounded-lg shadow p-4 flex flex-col h-[calc(100vh-140px)]">
          {selectedChatId ? (
            <>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  {renderAvatar(otherUser, "w-12 h-12")}
                  <div>
                    <div className="font-semibold">
                      {otherUser?.full_name || "Chat"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {otherUser?._id
                        ? onlineState[otherUser._id]
                          ? "Online"
                          : "Offline"
                        : "Loading chat..."}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button
                    className="px-3 py-1 text-xs rounded-full border border-gray-200 hover:bg-gray-50"
                    onClick={() => setShowChatList((prev) => !prev)}
                  >
                    Chats
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() =>
                      selectedChat &&
                      handleToggleFavorite(
                        selectedChat._id,
                        !selectedChat.isFavorite,
                      )
                    }
                  >
                    {selectedChat?.isFavorite ? (
                      <Star className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {showChatList && (
                    <div className="absolute right-0 top-10 w-80 bg-white border rounded-xl shadow-lg z-10">
                      <div className="p-3 border-b">
                        <input
                          value={chatSearch}
                          onChange={(e) => setChatSearch(e.target.value)}
                          placeholder="Search chats..."
                          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {filteredChats.length === 0 ? (
                          <div className="p-4 text-xs text-gray-400 text-center">
                            No chats found.
                          </div>
                        ) : (
                          filteredChats.map((chat) => {
                            const participant =
                              chat.participants?.find(
                                (user) => user._id !== currentUser?._id,
                              ) || {};
                            return (
                              <button
                                key={chat._id}
                                onClick={() => {
                                  handleSelectChat(chat._id);
                                  setShowChatList(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                                  selectedChatId === chat._id
                                    ? "bg-blue-50"
                                    : ""
                                }`}
                              >
                                <div className="relative">
                                  {renderAvatar(participant, "w-10 h-10")}
                                  <span
                                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                      onlineState[participant._id]
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">
                                    {participant.full_name || "Unknown"}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {chat.lastMessageText || ""}
                                  </div>
                                </div>
                                {chat.unreadCount > 0 && (
                                  <span className="text-[10px] bg-blue-600 text-white rounded-full px-2 py-1">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {activeMessages.length === 0 && (
                  <div className="text-center text-xs text-gray-400">
                    No messages yet.
                  </div>
                )}
                {activeMessages.map((msg) => {
                  const isMe = msg.sender?._id === currentUser?._id;
                  if (msg.deletedForEveryone) {
                    return (
                      <div
                        key={msg._id}
                        className="text-center text-xs text-gray-400"
                      >
                        This message was deleted
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                      >
                        {msg.replyTo && (
                          <div className="text-xs opacity-70 mb-2 border-l-2 pl-2">
                            Replying to: {msg.replyTo.text || "Attachment"}
                          </div>
                        )}
                        {msg.text && (
                          <div className="text-sm break-words">
                            {renderTextWithLinks(msg.text)}
                          </div>
                        )}
                        {(msg.attachments || []).length > 0 && (
                          <div className="mt-2 space-y-2">
                            {msg.attachments.map((att, index) => (
                              <div
                                key={`${msg._id}-att-${index}`}
                                className="rounded-lg overflow-hidden"
                              >
                                {att.type?.startsWith("image") && (
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="w-full max-h-64 object-cover"
                                  />
                                )}
                                {att.type?.startsWith("video") && (
                                  <video
                                    src={att.url}
                                    controls
                                    className="w-full"
                                  />
                                )}
                                {att.type?.startsWith("audio") && (
                                  <audio
                                    src={att.url}
                                    controls
                                    className="w-full"
                                  />
                                )}
                                {!att.type?.startsWith("image") &&
                                  !att.type?.startsWith("video") &&
                                  !att.type?.startsWith("audio") && (
                                    <a
                                      href={att.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs underline"
                                    >
                                      {att.name || "Attachment"}
                                    </a>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.reactions?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.reactions.map((reaction) => (
                              <span
                                key={`${msg._id}-${reaction.emoji}`}
                                className="text-xs bg-white/20 px-2 py-1 rounded-full"
                              >
                                {reaction.emoji} {reaction.userIds?.length || 0}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <button
                            onClick={() => setReplyTo(msg)}
                            className="hover:underline flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" /> Reply
                          </button>
                          <button
                            onClick={() => setActiveReactionMessage(msg._id)}
                            className="hover:underline flex items-center gap-1"
                          >
                            <Smile className="w-3 h-3" /> React
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id, "me")}
                            className="hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                          {isMe && (
                            <button
                              onClick={() => handleDelete(msg._id, "everyone")}
                              className="hover:underline"
                            >
                              Delete for everyone
                            </button>
                          )}
                        </div>
                        {activeReactionMessage === msg._id && (
                          <div className="mt-2 flex gap-2">
                            {REACTIONS.map((emoji) => (
                              <button
                                key={`${msg._id}-${emoji}`}
                                onClick={() => handleReaction(msg._id, emoji)}
                                className="text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                        {isMe && (
                          <div className="text-[10px] mt-1 text-right">
                            {(msg.readBy || []).length > 1 ? "✓✓" : "✓"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {typingUsers.length > 0 && (
                  <div className="text-xs text-gray-400">Typing...</div>
                )}
                <div ref={messageEndRef} />
              </div>

              <div className="border-t pt-3">
                {replyTo && (
                  <div className="mb-2 text-xs bg-gray-100 rounded-lg p-2 flex items-center justify-between">
                    <span>Replying to: {replyTo.text || "Attachment"}</span>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-gray-500"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {pendingFiles.length > 0 && (
                  <div className="mb-2 flex gap-2 overflow-x-auto">
                    {pendingFiles.map((item) => (
                      <div key={item.id} className="relative">
                        {item.file.type.startsWith("image") ? (
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                            {item.file.name}
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveFile(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleAddFiles}
                    />
                  </label>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {hasLoadedChats && dedupedChats.length === 0
                ? "No chats yet. Start a chat with a seller."
                : "Select a chat to start messaging."}
            </div>
          )}
        </section>

        <aside className="bg-white rounded-lg shadow p-4 h-[calc(100vh-140px)] overflow-y-auto">
          <div className="font-semibold mb-4">Profile</div>
          {otherUser ? (
            <>
              <div className="flex flex-col items-center mb-4">
                {renderAvatar(otherUser, "w-20 h-20")}
                <div className="mt-2 font-medium">{otherUser.full_name}</div>
                <div className="text-xs text-gray-500">
                  {otherUser.department || ""}
                </div>
                <span
                  className={`mt-2 px-3 py-1 text-xs rounded-full ${onlineState[otherUser._id] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {onlineState[otherUser._id] ? "Online" : "Offline"}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-2 text-xs mb-3">
                  {[
                    { key: "images", label: "Images" },
                    { key: "files", label: "Files" },
                    { key: "links", label: "Links" },
                    { key: "audio", label: "Music" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveMediaTab(tab.key)}
                      className={`px-3 py-1 rounded-full ${
                        activeMediaTab === tab.key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {activeMediaTab === "images" && (
                  <div className="grid grid-cols-3 gap-2">
                    {mediaByType.images.map((img, index) => (
                      <img
                        key={`img-${index}`}
                        src={img.url}
                        alt={img.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                {activeMediaTab === "files" && (
                  <div className="space-y-2 text-xs">
                    {mediaByType.files.map((file, index) => (
                      <a
                        key={`file-${index}`}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {file.name || "File"}
                      </a>
                    ))}
                  </div>
                )}
                {activeMediaTab === "links" && (
                  <div className="space-y-2 text-xs">
                    {mediaByType.links.map((link, index) => (
                      <a
                        key={`link-${index}`}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
                {activeMediaTab === "audio" && (
                  <div className="space-y-2">
                    {mediaByType.audio.map((audio, index) => (
                      <audio
                        key={`audio-${index}`}
                        src={audio.url}
                        controls
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              Pick a chat to see profile details.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default MessagePage;
