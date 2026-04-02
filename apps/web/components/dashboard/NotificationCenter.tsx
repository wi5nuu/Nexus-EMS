"use client";

import React, { useEffect } from "react";
import { Bell, Check, X, AlertTriangle, MessageSquare, CheckCircle, Rocket } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type NotificationType = "ticket_alert" | "task_mention" | "leave_approval" | "system" | "sla_breach" | "deploy" | "approved";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
};

interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: "init-1",
      type: "sla_breach",
      title: "SLA BREACH WARNING",
      message: "NX-507 (Production DB Spike) breaches in 1h 12m. Take action now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
    },
    {
      id: "init-2",
      type: "task_mention",
      title: "Rania mentioned you in NX-491",
      message: "\"Can you take a look at this race condition? I think it's related to your recent changes.\"",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      isRead: false,
    },
    {
      id: "init-3",
      type: "deploy",
      title: "Deploy completed: v2.4.1",
      message: "Production deployment of Vanguard Platform v2.4.1 completed successfully.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
    },
    {
      id: "init-4",
      type: "approved",
      title: "Leave request approved",
      message: "Your annual leave request for Jun 20–25 has been approved by HR.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true,
    },
  ],
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
  })),
  unreadCount: () => get().notifications.filter(n => !n.isRead).length
}));

const typeConfig: Record<NotificationType, { icon: React.ElementType; borderColor: string; iconColor: string; bgColor: string }> = {
  sla_breach: { icon: AlertTriangle, borderColor: "border-crimson-500", iconColor: "text-crimson-500", bgColor: "bg-crimson-500/10" },
  task_mention: { icon: MessageSquare, borderColor: "border-sapphire-500", iconColor: "text-sapphire-400", bgColor: "bg-sapphire-500/10" },
  ticket_alert: { icon: AlertTriangle, borderColor: "border-amber-500", iconColor: "text-amber-500", bgColor: "bg-amber-500/10" },
  leave_approval: { icon: CheckCircle, borderColor: "border-emerald-500", iconColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  approved: { icon: CheckCircle, borderColor: "border-emerald-500", iconColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  system: { icon: Bell, borderColor: "border-violet-500", iconColor: "text-violet-400", bgColor: "bg-violet-500/10" },
  deploy: { icon: Rocket, borderColor: "border-teal-500", iconColor: "text-teal-400", bgColor: "bg-teal-500/10" },
};

export function NotificationCenter() {
  const { notifications, addNotification, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    const socket = getSocket();
    socket.on('notification', (data: Notification) => {
      addNotification({
        ...data,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        isRead: false
      });
    });
    return () => { socket.off('notification'); };
  }, [addNotification]);

  const count = unreadCount();
  const todayItems = notifications.filter(n => {
    const d = new Date(n.timestamp);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const olderItems = notifications.filter(n => {
    const d = new Date(n.timestamp);
    const today = new Date();
    return d.toDateString() !== today.toDateString();
  });

  // SLA breach always first
  const sortedToday = [
    ...todayItems.filter(n => n.type === "sla_breach"),
    ...todayItems.filter(n => n.type !== "sla_breach"),
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-text-secondary hover:text-text-primary transition-fast"
          aria-label={`Notifications, ${count} unread`}
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-crimson-500 text-[9px] font-bold text-white flex items-center justify-center shadow">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 border-border-default bg-bg-panel shadow-lg overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <h4 className="font-syne font-semibold text-sm text-text-primary">Notifications</h4>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium text-text-secondary hover:text-text-primary"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-14 text-center">
              <div className="h-10 w-10 rounded-full bg-bg-elevated mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-text-primary">All caught up!</p>
              <p className="text-xs text-text-tertiary mt-1">No new notifications.</p>
            </div>
          ) : (
            <>
              {sortedToday.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] font-mono font-bold tracking-widest text-text-tertiary uppercase border-b border-border-subtle bg-bg-page/30">
                    TODAY
                  </div>
                  {sortedToday.map((n) => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
                  ))}
                </div>
              )}
              {olderItems.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] font-mono font-bold tracking-widest text-text-tertiary uppercase border-b border-border-subtle bg-bg-page/30">
                    EARLIER
                  </div>
                  {olderItems.map((n) => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border-subtle px-4 py-2.5 flex justify-center">
          <Button variant="ghost" size="sm" className="text-[12px] font-medium text-brand-text hover:text-brand-hover w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification: n, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) {
  const config = typeConfig[n.type] || typeConfig.system;
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3.5 border-b border-border-subtle transition-fast cursor-pointer group",
        !n.isRead ? "bg-brand-muted/30 hover:bg-brand-muted/50" : "hover:bg-bg-elevated",
        n.type === "sla_breach" && !n.isRead && "bg-crimson-500/5 hover:bg-crimson-500/10"
      )}
      onClick={() => !n.isRead && onMarkRead(n.id)}
    >
      {/* Left accent bar (unread) */}
      {!n.isRead && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full", config.borderColor)} />
      )}

      <div className={cn(
        "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5",
        config.bgColor
      )}>
        <IconComponent className={cn("h-4 w-4", config.iconColor)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-[13px] font-semibold leading-tight",
            n.isRead ? "text-text-secondary" : "text-text-primary"
          )}>
            {n.title}
          </p>
          <span className="text-[10px] text-text-tertiary font-mono shrink-0 mt-0.5">
            {formatDistanceToNow(new Date(n.timestamp), { addSuffix: false })}
          </span>
        </div>
        <p className="text-[12px] text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">
          {n.message}
        </p>
      </div>

      {!n.isRead && (
        <button
          className="shrink-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-bg-elevated flex items-center justify-center transition-fast mt-0.5"
          onClick={(e) => { e.stopPropagation(); onMarkRead(n.id); }}
          aria-label="Dismiss notification"
        >
          <X className="h-3 w-3 text-text-tertiary" />
        </button>
      )}
    </div>
  );
}
