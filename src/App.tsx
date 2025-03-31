import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface Channel {
  id: number;
  name: string;
}

interface Message {
  username: string;
  text: string;
}

const App: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Fetch channels from the API
  useEffect(() => {
    fetch('http://localhost:3001/api/channels')
      .then((response) => response.json())
      .then((data) => setChannels(data))
      .catch((error) => console.error('Error fetching channels:', error));
  }, []);

  // Fetch messages when a channel is selected
  useEffect(() => {
    if (selectedChannel?.id) {
      setLoading(true);
      fetch(`http://localhost:3001/api/messages/${selectedChannel.id}`)
        .then((response) => response.json())
        .then((data) => {
          setMessages(data?.reverse());
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
          setLoading(false);
        });
    }
  }, [selectedChannel]);

  // Send message to the server
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        username: 'Parth Bhanushali',
        text: newMessage.trim(),
      };

      setIsSending(true);

      fetch(`http://localhost:3001/api/messages/${selectedChannel?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
        .then(() => {
          setMessages((prevMessages) => [...prevMessages, message]);
          setNewMessage('');
          setIsSending(false);
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          setIsSending(false);
        });
    }
  };

  // Handle Enter and Shift+Enter for sending/adding new lines
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to convert newlines into <br /> elements when displaying the message
  const renderMessageWithNewlines = (message: string) => {
    return message?.split('\n')?.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {part}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Dropdown for Channels */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Slack Channels</h2>

        {/* Dropdown for Channel Selection */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-md"
          >
            <span>{selectedChannel?.name || 'Select Channel'}</span>
            {dropdownOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {dropdownOpen && (
            <ul className="absolute bg-gray-700 text-white w-full mt-1 rounded-md shadow-lg max-h-64 overflow-auto z-10">
              {channels.map((channel) => (
                <li
                  key={channel.id}
                  className="cursor-pointer hover:bg-gray-600 p-3 transition-all"
                  onClick={() => {
                    setSelectedChannel(channel);
                    setDropdownOpen(false); // Close the dropdown after selecting
                  }}
                >
                  {channel.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className="flex-1 bg-white p-6 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{selectedChannel.name} Messages</h2>
              <MessageCircle className="text-gray-500" size={24} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto mb-4">
              {loading ? (
                <div>Loading messages...</div>
              ) : (
                <ul className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      return (
                        <li key={idx} className="bg-gray-50 p-3 rounded-md shadow-sm">
                        <strong className="font-medium">{msg.username}: </strong>
                        <span>{renderMessageWithNewlines(msg.text)}</span>
                        </li>
                      )
                    })
                  ) : (
                    <li>No messages in this channel yet.</li>
                  )}
                </ul>
              )}
            </div>

            {/* Text area input for new message */}
            <div className="flex items-center space-x-2 mt-4">
              <textarea
                className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Handle Enter and Shift+Enter
                rows={3}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none"
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center text-gray-500 flex-1">
            <p>Select a channel to see messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
