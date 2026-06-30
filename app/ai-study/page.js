"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Send, Sparkles, BookOpen, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "General",
];

const STARTER_PROMPTS = [
  "I'm stuck on a quadratic equation word problem.",
  "My recursive function keeps returning undefined.",
  "I don't understand why osmosis happens at the cellular level.",
  "Can you help me structure an essay argument?",
];

export default function AIStudyPage() {
  const [subject, setSubject] = useState("General");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const askMutation = useMutation({
    mutationFn: async ({ studentQuestion, history }) => {
      const response = await api.post("/ai/homework-helper", {
        studentQuestion,
        subjectContext: subject,
        history,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "model", text: data.aiHint }]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "The AI assistant couldn't respond.",
      );
      // Roll back the optimistic user message's pending state by leaving it,
      // just don't add a model reply.
    },
  });

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || askMutation.isPending) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setDraft("");
    askMutation.mutate({ studentQuestion: trimmed, history });
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(draft);
  }

  function resetConversation() {
    setMessages([]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles size={14} />
              AI Study Assistant
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Work through a problem, step by step.
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              This assistant guides you toward the answer with hints, it won't
              just hand you the solution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {messages.length > 0 && (
              <button
                onClick={resetConversation}
                title="Start a new conversation"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-slate-300 hover:text-slate-700"
              >
                <RotateCcw size={14} />
                New chat
              </button>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto py-8">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <BookOpen size={22} />
              </div>
              <p className="mt-4 max-w-sm text-sm text-slate-500">
                Describe what you're stuck on, in any subject. The more specific
                you are, the better the guidance.
              </p>

              <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatBubble key={index} role={message.role} text={message.text} />
          ))}

          {askMutation.isPending && (
            <ChatBubble role="model" text="" isTyping />
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-1 mt-2 flex items-end gap-3 border-t border-slate-100 bg-white py-4"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(draft);
              }
            }}
            rows={1}
            placeholder="Describe the problem you're working on..."
            className="max-h-32 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={askMutation.isPending || !draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </main>
    </div>
  );
}

function ChatBubble({ role, text, isTyping }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-emerald-600 text-white"
            : "border border-slate-200 bg-slate-50 text-slate-700"
        }`}
      >
        {isTyping ? (
          <span className="flex gap-1 py-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{text}</p>
        )}
      </div>
    </div>
  );
}
