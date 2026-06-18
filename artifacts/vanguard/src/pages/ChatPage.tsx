export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-0px)]">
      <div className="w-72 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-3 w-24 bg-muted rounded mb-1" />
                <div className="h-2 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <p className="text-sm text-muted-foreground">Select a conversation</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground text-center mt-20">
            Chat placeholder — messages, offers, images, attachments, and dispute evidence storage not yet implemented.
          </p>
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
