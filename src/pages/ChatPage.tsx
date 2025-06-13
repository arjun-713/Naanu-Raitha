import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { generateResponse, ChatMessage } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mitra - Your AI Farming Assistant</h1>
          <p className="text-lg text-gray-600">AI Chat is coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
