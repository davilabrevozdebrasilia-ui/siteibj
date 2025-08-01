import { useState, useEffect } from "react";

export default function LazyCardWrapper({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsVisible(true), Math.random() * 500 + 300); // efeito de delay
        return () => clearTimeout(timeout);
    }, []);

    if (!isVisible) {
        return (
            <div className="bg-slate-200 animate-pulse rounded-md w-full h-52" />
        );
    }

    return <>{children}</>;
}
