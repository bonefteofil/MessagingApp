
function formatLocalDate(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function formatLastMessageDate(date: string) {
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

export function formatMessageTime(date: string) {
    return formatLocalDate(new Date(date)).toTimeString().substring(0, 5);
}

export function formatFullDate(date: string) {
    const localDate = formatLocalDate(new Date(date));
    if (localDate.toDateString() === new Date().toDateString()) {
        return "Today";
    }
    if (localDate.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
        return "Yesterday";
    }
    return localDate.toLocaleDateString([], {
        weekday: 'long',
        day: "2-digit",
        month: 'long',
        year: 'numeric',
    });
};