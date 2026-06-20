import { Paperclip, Mic, Send, Shield } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "seller",
    text: "Hello, the item is still available.",
  },
  {
    id: 2,
    sender: "buyer",
    text: "What's your final price?",
  },
  {
    id: 3,
    sender: "seller",
    text: "₦850,000 is my final price.",
  },
];

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="hidden md:flex w-80 border-r bg-card flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">
            Messages
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Array.from({ length: 10 }).map(
            (_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg hover:bg-accent cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />

                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Seller {i + 1}
                    </p>

                    <p className="text-xs text-muted-foreground truncate">
                      Last message...
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                John Electronics
              </h2>

              <p className="text-xs text-green-500">
                Online
              </p>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 rounded-md border">
              <Shield className="h-4 w-4" />
              Escrow
            </button>
          </div>

          <div className="mt-3 p-3 rounded-lg border bg-card">
            <p className="font-medium">
              iPhone 15 Pro Max
            </p>

            <p className="text-sm text-muted-foreground">
              ₦850,000
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={flex ${                 message.sender === "buyer"                   ? "justify-end"                   : "justify-start"               }}
            >
              <div
                className={max-w-[75%] px-4 py-3 rounded-2xl ${                   message.sender === "buyer"                     ? "bg-primary text-primary-foreground"                     : "bg-muted"                 }}
              >
                {message.text}
              </div>
            </div>
          ))}

          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-2xl">
              🎤 Voice Note (0:14)
            </div>
          </div>
        </div>

        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-md border flex items-center justify-center">
              <Paperclip className="h-4 w-4" />
            </button>

            <button className="h-10 w-10 rounded-md border flex items-center justify-center">
              <Mic className="h-4 w-4" />
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />

            <button className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}