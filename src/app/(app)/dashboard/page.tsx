"use client";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),

    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => String(message._id) !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");

      setValue("acceptMessages", response.data.isAcceptingMessages || false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(axiosError.response?.data.message || "Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");

      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success("Messages refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(axiosError.response?.data.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(axiosError.response?.data.message || "Failed to update message settings");
    }
  };

  if (!session || !session.user) {
    return <div />;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast.success("Profile URL copied!");
  };

  return (
    <div className="mx-4 my-8 w-full max-w-6xl rounded bg-white p-6 md:mx-8 lg:mx-auto">
      <h1 className="mb-4 text-4xl font-bold">User Dashboard</h1>

      {/* Copy Link */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>

        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="mr-2 w-full rounded border p-2" />

          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Switch */}
      <div className="mb-4 flex items-center">
        <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />

        <span className="ml-2">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>

      <Separator />

      {/* Refresh Button */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();

          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      {/* Messages */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">{messages.length > 0 ? messages.map((message) => <MessageCard key={String(message._id)} message={message} onMessageDelete={handleDeleteMessage} />) : <p>No messages to display.</p>}</div>
    </div>
  );
}

export default UserDashboard;
