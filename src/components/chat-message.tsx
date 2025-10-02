import type { Message } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Bot, User, Info } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  return (
    <div className={cn("flex gap-3 items-start", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser && "bg-primary text-primary-foreground",
          !isUser && !isSystem && "bg-secondary text-secondary-foreground",
          isSystem && "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : isSystem ? <Info className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser && "bg-primary text-primary-foreground",
            !isUser && !isSystem && "bg-muted text-foreground",
            isSystem && "bg-accent/20 text-accent-foreground border border-accent",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-1">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
