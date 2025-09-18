"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Avatar, ChatMessage, UserDocument } from "@/lib/database"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [mountedMessageIds, setMountedMessageIds] = useState<Set<number | string>>(new Set())
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const quickReplies = [
    "Summarize the latest tax policy changes",
    "How does a 5% tax increase affect my avatar?",
    "Run a healthcare policy simulation",
    "Compare education funding proposals",
    "What subsidies could help my household?",
  ]

  useEffect(() => {
    fetchAvatars()
    fetchMessages()
    fetchDocuments()
  }, [])

  useEffect(() => {
    // Auto-select avatar from URL params
    const avatarParam = searchParams.get("avatar")
    if (avatarParam && avatars.length > 0) {
      const avatarId = Number.parseInt(avatarParam)
      if (avatars.find((a) => a.id === avatarId)) {
        setSelectedAvatarId(avatarId)
      }
    }
  }, [searchParams, avatars])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchAvatars = async () => {
    try {
      const response = await fetch("/api/avatars")
      if (response.ok) {
        const data = await response.json()
        setAvatars(data)
      }
    } catch (error) {
      console.error("Error fetching avatars:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/chat/documents")
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return
    setLoading(true)

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now(),
      user_id: "demo-user",
      simulation_id: null,
      message_type: "user",
      content: messageText,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMountedMessageIds((prev) => new Set(prev).add(userMessage.id))

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          avatar_id: selectedAvatarId,
          document_ids: selectedDocIds,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          id: data.assistant_message.id,
          user_id: "demo-user",
          simulation_id: null,
          message_type: "assistant",
          content: data.assistant_message.content,
          created_at: data.assistant_message.created_at,
        }
        setMessages((prev) => [...prev, assistantMessage])
        setMountedMessageIds((prev) => new Set(prev).add(assistantMessage.id))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        user_id: "demo-user",
        simulation_id: null,
        message_type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setMountedMessageIds((prev) => new Set(prev).add(errorMessage.id))
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const messageText = inputMessage.trim()
    if (!messageText) return
    setInputMessage("")
    await sendMessage(messageText)
  }

  const handleQuickReplyClick = async (text: string) => {
    if (loading) return
    setInputMessage("")
    await sendMessage(text)
  }

  const openFilePicker = () => {
    if (uploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/chat/documents", {
        method: "POST",
        body: form,
      })
      if (res.ok) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const toggleSelectDoc = (id: number) => {
    setSelectedDocIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }

  const deleteDocument = async (id: number) => {
    try {
      const res = await fetch(`/api/chat/documents/${id}`, { method: "DELETE" })
      if (res.ok) {
        setSelectedDocIds((prev) => prev.filter((d) => d !== id))
        await fetchDocuments()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const selectedAvatar = selectedAvatarId ? avatars.find((a) => a.id === selectedAvatarId) : null

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Policy Chat</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discuss policies and run simulations with your AI assistant
            </p>
          </div>

          {/* Avatar Selection */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              {avatars.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You need to create an avatar first to get personalized policy analysis.
                  </p>
                  <Button onClick={() => router.push("/avatars/create")}>Create Your First Avatar</Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedAvatarId?.toString() || ""}
                    onValueChange={(value) => setSelectedAvatarId(value ? Number.parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose an avatar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {avatars.map((avatar) => (
                        <SelectItem key={avatar.id} value={avatar.id.toString()}>
                          {avatar.name} (Age {avatar.age}, ${avatar.income.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAvatar && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>👤</span>
                      {selectedAvatar.name}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🤖</div>
                    <p>Start a conversation about policy impacts!</p>
                    <p className="text-sm mt-2">
                      Try asking: "How would a 5% tax increase affect my avatar?" or "Tell me about healthcare policies"
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.message_type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${message.message_type === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.message_type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {message.message_type === "user" ? "👤" : "🤖"}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none ${
                            message.message_type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border"
                          } ${
                            mountedMessageIds.has(message.id)
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.message_type === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="border-t px-4 pt-3 pb-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {quickReplies.map((qr) => (
                    <Button
                      key={qr}
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                      disabled={loading}
                      onClick={() => handleQuickReplyClick(qr)}
                      aria-label={`Quick reply: ${qr}`}
                    >
                      {qr}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Documents: upload and select */}
              <div className="border-t px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {documents.length === 0 ? (
                      <span className="text-xs text-gray-500">No documents uploaded</span>
                    ) : (
                      documents.map((doc) => {
                        const active = selectedDocIds.includes(doc.id)
                        return (
                          <button
                            key={doc.id}
                            onClick={() => toggleSelectDoc(doc.id)}
                            className={`text-xs border rounded-md px-2 py-1 transition-colors shrink-0 ${
                              active
                                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                            }`}
                            aria-pressed={active}
                            title={doc.name}
                          >
                            <span className="mr-1">📄</span>
                            {doc.name}
                          </button>
                        )
                      })
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.json,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={uploading}>
                      {uploading ? "Uploading…" : "Upload"}
                    </Button>
                    {selectedDocIds.length > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          // delete all selected docs
                          for (const id of selectedDocIds) {
                            // eslint-disable-next-line no-await-in-loop
                            await deleteDocument(id)
                          }
                        }}
                      >
                        Delete Selected
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about a policy or request a simulation..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !inputMessage.trim()}>
                    {loading ? "⏳" : "📤"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
