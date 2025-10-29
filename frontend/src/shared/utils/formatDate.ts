import type GroupScheme from "@groups/schema";
import type MessageScheme from "@messages/schema";


export function transformMessageDate(message: MessageScheme) {
    return {
        ...message,
        createdAt: formatFullDate(message.createdAt!),
        createdTime: formatMessageTime(message.createdAt!)
    } as MessageScheme;
}

export function transformGroupDate(group: GroupScheme) {
    return {
        ...group,
        lastMessageAt: formatLastMessageDate(group.lastMessageAt!),
        createdAt: formatFullDate(group.createdAt!)
    } as GroupScheme;
}


function formatLastMessageDate(date: string) {
    const localDate = formatLocalDate(new Date(date));
    if (localDate.toDateString() === new Date().toDateString()) {
        return localDate.toTimeString().substring(0, 5);
    }
    if (localDate.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
        return "Yesterday";
    }
    return localDate.toLocaleDateString([], {
        day: "2-digit",
        month: '2-digit',
        year: 'numeric',
    });
};

function formatFullDate(date: string) {
    const localDate = formatLocalDate(new Date(date));

    if (isToday(localDate)) return "Today";

    if (isYesterday(localDate)) return "Yesterday";

    return localDate.toLocaleDateString([], {
        weekday: 'long',
        day: "2-digit",
        month: 'long',
        year: 'numeric',
    });
};

function formatMessageTime(date: string) {
    return formatLocalDate(new Date(date)).toTimeString().substring(0, 5);
}

function formatLocalDate(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

function isToday(date: Date) {
    return date.toDateString() === new Date().toDateString();
}

function isYesterday(date: Date) {
    return date.toDateString() === new Date(Date.now() - 86400000).toDateString();
}
