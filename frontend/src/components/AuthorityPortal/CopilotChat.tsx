import React, { useState } from 'react';
import { Bot, Send, Sparkles, Database, ShieldAlert, Cpu } from 'lucide-react';
import axios from 'axios';

interface CopilotChatProps {
  city: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({ city }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'copilot'; text: string; sources?: string[] }>>([
    {
      sender: 'copilot',
      text: `Greetings Officer. I am the AERIS AI Environmental Copilot. Ask me any question regarding active hotspots, spatiotemporal forecasts, exposure counts, or authority interventions in ${city}.`,
      sources: ['AERIS Real-Time Database Gateway']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "What are the critical pollution hotspots in Hyderabad?",
    "Why was Hotspot #H1042 detected?",
    "How many people and schools are exposed?",
    "Show active unresolved authority interventions."
  ];

  const handleSend = async (qText?: string) => {
    const questionToAsk = qText || input;
    if (!questionToAsk.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: questionToAsk }]);
    if (!qText) setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/v1/copilot/ask', {
        question: questionToAsk,
        city: city
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: res.data.answer,
          sources: res.data.sources_used
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: "Currently unable to query backend database state. Please check API gateway.",
          sources: ["System Gateway Error"]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-navy-900 border border-command-border rounded-xl p-5 space-y-4 flex flex-col h-[520px]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
              <span>AERIS AI COPILOT</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Grounded RAG Assistant backed by Real Backend Database State</p>
          </div>
        </div>

        <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          No Hallucinations Guarantee
        </span>
      </div>

      {/* Sample Quick Questions */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 flex-shrink-0">
        <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Suggested Queries:</span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-[11px] bg-navy-950 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-800 rounded-lg px-2.5 py-1 whitespace-nowrap transition"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-navy-950 text-slate-200 border border-slate-800'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>

              {m.sources && m.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-1 text-[10px] text-slate-400">
                  <Database className="w-3 h-3 text-sky-400" />
                  <span>Data Sources: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-navy-950 p-3 rounded-2xl border border-slate-800 text-xs text-sky-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Querying PostGIS & AERIS Data Engine...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot about hotspots, exposure, or predictions..."
          className="flex-1 bg-navy-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading}
          className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-xl transition shadow-lg shadow-sky-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
