// components/LineMessageSender.tsx
import { useState } from 'react';
import axios from 'axios';

interface LineMessageSenderProps {
  userId: string;
}

export default function LineMessageSender({ userId }: LineMessageSenderProps) {
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
  }>({ loading: false });

  const sendMessage = async () => {
    if (!message.trim()) {
      setStatus({ loading: false, error: 'Message cannot be empty' });
      return;
    }

    try {
      setStatus({ loading: true });
      console.log('Sending message:', message);
      
      const response = await axios.post('/api/send-message', {
        userId,
        message
      });
      
      console.log('Response:', response.data);
      setStatus({ loading: false, success: true });
      setMessage(''); // Clear message input after successful send
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus({ loading: false });
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    //   setStatus({ 
    //     loading: false, 
    //     error: error.response?.data?.message || 'Failed to send message' 
    //   });
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      <div className="flex flex-col">
        <label htmlFor="message" className="text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-md p-2 min-h-[100px]"
          placeholder="Type your message here..."
        />
      </div>
      
      <button
        onClick={sendMessage}
        disabled={status.loading}
        className={`px-4 py-2 rounded-md ${
          status.loading 
            ? 'bg-gray-400' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium`}
      >
        {status.loading ? 'Sending...' : 'Send Message'}
      </button>
      
      {status.error && (
        <div className="text-red-500 text-sm">{status.error}</div>
      )}
      
      {status.success && (
        <div className="text-green-500 text-sm">Message sent successfully!</div>
      )}
    </div>
  );
}