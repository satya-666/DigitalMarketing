import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Chat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatIdFromUrl = searchParams.get('active');

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  
  // Real-time statuses
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Fetch all user chat threads on load
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/chats');
        setChats(res.data);

        // If an active ID is provided in URL, load it
        if (activeChatIdFromUrl) {
          const chat = res.data.find(c => c.id === Number(activeChatIdFromUrl));
          if (chat) setActiveChat(chat);
        } else if (res.data.length > 0) {
          // Default to first chat thread
          setActiveChat(res.data[0]);
          setSearchParams({ active: res.data[0].id });
        }
      } catch (err) {
        console.error('Failed to load chat list:', err);
      }
    };
    fetchChats();
  }, [activeChatIdFromUrl, setSearchParams]);

  // 2. Load messages and subscribe to room events when active chat changes
  useEffect(() => {
    if (!activeChat || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chats/${activeChat.id}/messages`);
        setMessages(res.data);
        scrollToBottom();

        // Mark messages as read on server & emit receipt
        socket.emit('markAsRead', { chatId: activeChat.id, userId: user.id });
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    // Join room
    socket.emit('joinChat', activeChat.id);

    // Query recipient online status
    socket.emit('checkUserStatus', activeChat.recipient_id);

    // Socket Event Handlers
    const handleMessageReceived = (msg) => {
      if (msg.chat_id === activeChat.id) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
        // Clear unread on socket
        socket.emit('markAsRead', { chatId: activeChat.id, userId: user.id });
      }
      
      // Update snippet on threads list
      setChats(prev => prev.map(c => {
        if (c.id === msg.chat_id) {
          return { ...c, last_message: msg };
        }
        return c;
      }));
    };

    const handleTypingResponse = ({ chatId, senderId, isTyping }) => {
      if (chatId === activeChat.id && senderId === activeChat.recipient_id) {
        setIsRecipientTyping(isTyping);
      }
    };

    const handleUserStatusChanged = ({ userId, status }) => {
      if (userId === activeChat.recipient_id) {
        setIsRecipientOnline(status === 'online');
      }
    };

    const handleUserStatusResponse = ({ userId, status }) => {
      if (userId === activeChat.recipient_id) {
        setIsRecipientOnline(status === 'online');
      }
    };

    const handleMessagesRead = ({ chatId }) => {
      if (chatId === activeChat.id) {
        setMessages(prev => prev.map(m => m.sender_id === user.id ? { ...m, is_read: 1 } : m));
      }
    };

    socket.on('messageReceived', handleMessageReceived);
    socket.on('typingResponse', handleTypingResponse);
    socket.on('userStatusChanged', handleUserStatusChanged);
    socket.on('userStatusResponse', handleUserStatusResponse);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.emit('leaveChat', activeChat.id);
      socket.off('messageReceived', handleMessageReceived);
      socket.off('typingResponse', handleTypingResponse);
      socket.off('userStatusChanged', handleUserStatusChanged);
      socket.off('userStatusResponse', handleUserStatusResponse);
      socket.off('messagesRead', handleMessagesRead);
      setIsRecipientTyping(false);
    };
  }, [activeChat, socket, user.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket || !activeChat) return;

    // Emit message to Socket server
    socket.emit('sendMessage', {
      chatId: activeChat.id,
      senderId: user.id,
      recipientId: activeChat.recipient_id,
      messageText: messageText.trim()
    });

    setMessageText('');

    // Stop typing emit
    socket.emit('typing', { chatId: activeChat.id, senderId: user.id, isTyping: false });
  };

  // Dispatch typing events
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    if (!socket || !activeChat) return;

    socket.emit('typing', { chatId: activeChat.id, senderId: user.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { chatId: activeChat.id, senderId: user.id, isTyping: false });
    }, 2000);
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
    setSearchParams({ active: chat.id });
  };

  return (
    <div className="container fade-in">
      <div className="glass-panel chat-container">
        
        {/* Sidebar Panel */}
        <aside className="chat-sidebar">
          <div className="chat-search-container">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Conversations</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Select a contact thread</p>
          </div>

          <div className="chat-list">
            {chats.length === 0 ? (
              <p style={{ padding: '24px', fontSize: '0.9rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                No message logs found.
              </p>
            ) : (
              chats.map(chat => {
                const isSelected = activeChat && activeChat.id === chat.id;
                const hasUnread = chat.last_message && !chat.last_message.is_read && chat.last_message.sender_id !== user.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`chat-item ${isSelected ? 'active' : ''}`}
                    style={{ background: hasUnread ? 'rgba(var(--accent-primary-rgb), 0.04)' : '' }}
                  >
                    <div className="chat-avatar-container">
                      <img
                        src={chat.recipient_picture || '/uploads/default-avatar.png'}
                        alt={chat.recipient_name}
                        className="chat-avatar"
                        onError={(e) => { e.target.src = 'https://picsum.photos/60/60'; }}
                      />
                    </div>

                    <div className="chat-item-details">
                      <div className="chat-item-header">
                        <span className="chat-item-name" style={{ fontWeight: hasUnread ? 700 : 500 }}>
                          {chat.recipient_name}
                        </span>
                        {chat.last_message && (
                          <span className="chat-item-time">
                            {new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="chat-item-preview" style={{ fontWeight: hasUnread ? 600 : 400, color: hasUnread ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {chat.last_message ? chat.last_message.message_text : 'Start conversation...'}
                      </p>
                    </div>

                    {hasUnread && (
                      <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Messaging Area */}
        <main className="chat-area">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="chat-avatar-container">
                    <img
                      src={activeChat.recipient_picture || '/uploads/default-avatar.png'}
                      alt={activeChat.recipient_name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://picsum.photos/50/50'; }}
                    />
                    <span className={`status-indicator ${isRecipientOnline ? 'status-online' : 'status-offline'}`} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{activeChat.recipient_name}</h3>
                    <small style={{ color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                      {isRecipientOnline ? 'Online' : 'Offline'} • {activeChat.recipient_role}
                    </small>
                  </div>
                </div>
              </div>

              {/* Message Feed */}
              <div className="chat-messages">
                {messages.map(msg => {
                  const isOwn = msg.sender_id === user.id;

                  return (
                    <div key={msg.id} className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
                      <div>
                        <div className="message-bubble">
                          <p>{msg.message_text}</p>
                        </div>
                        <div className="message-info">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && (
                            <span style={{ color: msg.is_read ? 'var(--accent-secondary)' : 'var(--text-tertiary)' }}>
                              {msg.is_read ? '✓✓ Read' : '✓ Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Typing Indicator */}
                {isRecipientTyping && (
                  <div className="message-bubble-wrapper other">
                    <div className="message-bubble" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      {activeChat.recipient_name} is typing...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Form Input */}
              <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '50px' }}>
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
              <span style={{ fontSize: '4rem' }}>💬</span>
              <h3 style={{ marginTop: '16px' }}>NovaMarket Direct Chat</h3>
              <p>Select a contact thread from the list on the left to begin messaging</p>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};
