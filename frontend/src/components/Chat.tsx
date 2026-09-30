import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  messages: Message[];
};

const starterConversations: Conversation[] = [
  {
    id: 1,
    title: "Plan a weekend in Kyoto",
    messages: [],
  },
  {
    id: 2,
    title: "Explain quantum computing",
    messages: [],
  },
  {
    id: 3,
    title: "Refine my project brief",
    messages: [],
  },
  {
    id: 4,
    title: "Ideas for a dinner party",
    messages: [],
  },
];

function Chat() {
  const [conversations, setConversations] = useState(starterConversations);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(
    ({ id }) => id === activeId,
  ) ?? {
    id: 0,
    title: "New conversation",
    messages: [],
  };

  function selectConversation(id: number) {
    if (isLoading) return;
    setActiveId(id);
    setIsSidebarOpen(false);
  }

  function createConversation() {
    if (isLoading) return;
    setActiveId(null);
    setDraft("");
    setIsSidebarOpen(false);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();

    if (!content || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: "user", content };
    const conversationId = activeId ?? userMessage.id;

    setConversations((current) =>
      activeId === null
        ? [
            { id: conversationId, title: content, messages: [userMessage] },
            ...current,
          ]
        : current.map((conversation) =>
            conversation.id === activeId
              ? {
                  ...conversation,
                  title:
                    conversation.messages.length === 0
                      ? content
                      : conversation.title,
                  messages: [...conversation.messages, userMessage],
                }
              : conversation,
          ),
    );
    setActiveId(conversationId);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify({query:draft})
      });

      if (!response.ok) {
        throw new Error("The chat service is unavailable right now.");
      }

      const result = await response.json();
      const assistantMessage: Message = {
        id: Date.now(),
        role: "assistant",
        content: result.data.response,
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
              }
            : conversation,
        ),
      );
    } catch (error) {
      const assistantMessage: Message = {
        id: Date.now(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
              }
            : conversation,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#f7f8fa] text-[#1d2733]">
      {isSidebarOpen && (
        <button
          aria-label="Close chat history"
          className="fixed inset-0 z-20 bg-[#101820]/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[286px] shrink-0 flex-col border-r border-[#e2e7eb] bg-[#eef2f3] px-3 py-4 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-7 flex items-center justify-between px-2">
          <Link
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-[#18242e]"
            to="/chat"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#1c766c] text-[14px] font-bold text-white">
              C
            </span>
            compass
          </Link>
          <button
            aria-label="Close chat history"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#71808a] hover:bg-white lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>

        <button
          className="mb-5 flex h-11 items-center gap-2 rounded-xl border border-[#d6dfe2] bg-white px-3.5 text-sm font-medium text-[#263640] shadow-[0_1px_2px_rgba(18,35,44,0.04)] transition hover:border-[#a9c9c4] hover:bg-[#fbfffe]"
          onClick={createConversation}
          type="button"
        >
          <span className="text-lg leading-none text-[#1c766c]">＋</span>
          New chat
          <span className="ml-auto text-[11px] text-[#9aa5aa]">⌘ K</span>
        </button>

        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a979d]">
          Your chats
        </p>
        <nav
          aria-label="Chat history"
          className="flex-1 space-y-0.5 overflow-y-auto"
        >
          {conversations.map((conversation) => (
            <button
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${
                conversation.id === activeId
                  ? "bg-white font-medium text-[#1d3035] shadow-[0_1px_2px_rgba(18,35,44,0.04)]"
                  : "text-[#66757d] hover:bg-white/70 hover:text-[#263640]"
              }`}
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              disabled={isLoading}
              type="button"
            >
              <span className="text-[15px] text-[#91a0a6]">◌</span>
              <span className="truncate">{conversation.title}</span>
              <span className="ml-auto hidden text-[#a8b3b7] group-hover:block">
                ···
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-5 border-t border-[#dbe2e4] pt-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-[#66757d] hover:bg-white/70 hover:text-[#263640]"
            type="button"
            disabled={isLoading}
          >
            <span className="text-base">⚙</span>
            Settings
          </button>
          <div className="mt-3 flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9b48f] text-xs font-semibold text-[#5b3c29]">
              RK
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#34434a]">
                Test User
              </p>
              <p className="text-[11px] text-[#8a979d]">Free plan</p>
            </div>
            <span className="ml-auto text-[#98a5aa]">···</span>
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#e5e9eb] bg-[#fbfcfc] px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open chat history"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#51626a] hover:bg-[#eef2f3] lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              ☰
            </button>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#89969c]">
                Workspace
              </p>
              <h1 className="text-[15px] font-semibold text-[#24343c]">
                {activeConversation.title}
              </h1>
            </div>
          </div>
          <button
            aria-label="More options"
            className="text-xl tracking-[0.15em] text-[#8b989d] hover:text-[#43545c]"
            type="button"
          >
            ···
          </button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[780px] flex-1 flex-col px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
            {activeConversation.messages.length === 0 && !isLoading ? (
              <div className="m-auto w-full max-w-[580px] pb-16 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dceee9] text-2xl text-[#1c766c]">
                  ✦
                </div>
                <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-[#203039]">
                  What can I help with?
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-[#7a898f]">
                  Ask a question, brainstorm ideas, or work through something
                  together.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {activeConversation.messages.map((message) => (
                  <article
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex gap-3"
                    }
                    key={message.id}
                  >
                    {message.role === "assistant" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#dceee9] text-sm font-bold text-[#1c766c]">
                        C
                      </div>
                    )}
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[80%] rounded-2xl rounded-br-md bg-[#1c766c] px-4 py-3 text-[14px] leading-6 text-white"
                          : "max-w-[680px] pt-1 text-[14px] leading-7 text-[#43535b]"
                      }
                    >
                      {message.content}
                    </div>
                  </article>
                ))}
                {isLoading && (
                  <article
                    className="flex gap-3"
                    aria-label="Compass is thinking"
                  >
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#dceee9] text-sm font-bold text-[#1c766c]">
                      C
                    </div>
                    <div className="flex items-center gap-1 pt-2" role="status">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8aa9a4] [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8aa9a4] [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8aa9a4]" />
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gradient-to-t from-[#f7f8fa] via-[#f7f8fa] to-transparent px-5 pb-5 pt-4 sm:px-8 sm:pb-8">
            <form
              className="mx-auto flex w-full max-w-[780px] items-end gap-3 rounded-2xl border border-[#d9e1e3] bg-white p-2.5 pl-4 shadow-[0_8px_24px_rgba(32,48,57,0.06)] focus-within:border-[#9bc9c1] focus-within:ring-4 focus-within:ring-[#dceee9]"
              onSubmit={sendMessage}
            >
              <textarea
                aria-label="Message"
                className="max-h-32 min-h-[38px] flex-1 resize-none self-center bg-transparent py-2 text-[14px] leading-5 text-[#293a42] outline-none placeholder:text-[#99a6ab]"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Message compass..."
                value={draft}
                disabled={isLoading}
              />
              <button
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1c766c] text-xl text-white transition hover:bg-[#155f57] disabled:cursor-not-allowed disabled:bg-[#d3dfdd]"
                disabled={!draft.trim() || isLoading}
                type="submit"
              >
                ↑
              </button>
            </form>
            <p className="mt-3 text-center text-[11px] text-[#9aa6aa]">
              Compass can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Chat;
