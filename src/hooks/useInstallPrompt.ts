import { useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    prompt(): Promise<void>;
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

type Listener = () => void;

let installPrompt: BeforeInstallPromptEvent | null = null;

const listeners = new Set<Listener>();
const emit = () => listeners.forEach(l => l());

const subscribe = (l: Listener) => {
    listeners.add(l);
    return () => {
        listeners.delete(l);
    };
};

window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    installPrompt = e;
    emit();
});

window.addEventListener("appinstalled", () => {
    installPrompt = null;
    emit();
});

const install = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    return outcome;
};

export function useInstallPrompt() {
    const installable = useSyncExternalStore(
        subscribe,
        () => !!installPrompt,
        () => false,
    );

    return {
        installable,
        install,
    };
}
