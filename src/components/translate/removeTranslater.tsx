"use client";

import { useEffect } from "react";

export function RemoveSkipTranslateDiv() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node instanceof HTMLElement &&
                        node.classList.contains("skiptranslate")
                    ) {
                        console.log("Div skiptranslate detectada, será removida em 1s:", node);
                        setTimeout(() => {
                            node.remove();
                            console.log("Div skiptranslate removida:", node);
                        }, 2000); // espera 1 segundo antes de remover
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    return null;
}
