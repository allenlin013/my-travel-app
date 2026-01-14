"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChat({ itineraryData, colors }: { itineraryData: any, colors: any }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '你好！我是你的日本旅行助手，關於這次大阪京都行程有什麼想問的嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始化 Gemini
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 自動捲動到底部
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // 這裡將目前的行程作為 Context 傳給 AI，讓它「知道」你的計畫
      const prompt = `
        你是一個專業的日本旅遊導遊。
        以下是使用者目前的旅遊行程資料（JSON 格式）：
        ${JSON.stringify(itineraryData)}
        
        請根據上述行程回答使用者的問題：${userMessage}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，我現在連線有點問題..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-pink-50">
      {/* 聊天內容區 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-800' : 'bg-pink-100'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white"/> : <Bot size={14} className="text-pink-400"/>}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2 text-slate-300 ml-12">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] tracking-widest uppercase">AI Thinking...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 輸入區 */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="詢問行程建議..."
          className="flex-1 bg-white px-5 py-3 rounded-full text-xs outline-none border border-transparent focus:border-pink-200 transition-all"
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-pink-300 text-white p-3 rounded-full hover:bg-pink-400 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}