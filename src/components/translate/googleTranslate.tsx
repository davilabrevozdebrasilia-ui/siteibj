"use client";
import { useEffect } from "react";

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        __gt_changeLanguage?: (lang: string) => void;
    }
}

export function GoogleTranslateWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        window.googleTranslateElementInit = () => {
            try {
                new (window as any).google.translate.TranslateElement(
                    {
                        pageLanguage: "pt",
                        includedLanguages: "pt,en,es",
                        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    "google_translate_element"
                );
            } catch (e) {
            }
        };

        if (!document.querySelector('script[src*="translate_a/element.js"]')) {
            const s = document.createElement("script");
            s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            s.async = true;
            document.body.appendChild(s);
        }

        window.__gt_changeLanguage = (lang: string) => {
            tryChangeLanguage(lang);
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.id === ":2.container") {
                            node.remove();
                            console.log("Removido iframe :2.container!");
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // cleanup
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: "none" }} />
            <style jsx global>{`
                .goog-te-banner-frame,
                .goog-logo-link,
                #goog-gt-tt,
                .goog-te-balloon-frame {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
            `}</style>
            {children}
        </>
    );
}

export function changeLanguage(lang: string) {
    if (typeof window === "undefined") return;

    const trySelect = (): boolean => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event("change"));
            return true;
        }
        return false;
    };

    const tryIframeClick = (): boolean => {
        const menuIframe = document.querySelector('iframe.goog-te-menu-frame, iframe.goog-te-menu');
        if (!menuIframe) return false;
        try {
            const doc =
                (menuIframe as HTMLIFrameElement).contentDocument ||
                (menuIframe as HTMLIFrameElement).contentWindow?.document;
            if (!doc) return false;
            const link = doc.querySelector<HTMLElement>(`a[lang="${lang}"], a[hreflang="${lang}"]`);
            if (link) {
                link.click();
                return true;
            }
        } catch {
        }
        return false;
    };

    const setCookieAndReload = () => {
        const source = "pt";
        const cookieValue = `/${source}/${lang}`;
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        const cookie = `googtrans=${cookieValue};expires=${expires.toUTCString()};path=/;`;

        try {
            const hostname = location.hostname;
            if (hostname !== "localhost" && hostname !== "") {
                document.cookie = cookie + `domain=.${hostname};`;
            }
        } catch {
            // ignora
        }
        document.cookie = cookie;

        setTimeout(() => location.reload(), 150);
    };

    if (trySelect()) return;
    if (tryIframeClick()) return;
    setCookieAndReload();
}
function tryChangeLanguage(lang: string) {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        return;
    }

    const menuIframe = document.querySelector('iframe.goog-te-menu-frame, iframe.goog-te-menu');
    if (menuIframe) {
        try {
            const doc =
                (menuIframe as HTMLIFrameElement).contentDocument ||
                (menuIframe as HTMLIFrameElement).contentWindow?.document;
            const link = doc?.querySelector<HTMLElement>(`a[lang="${lang}"], a[hreflang="${lang}"]`);
            if (link) {
                link.click();
                return;
            }
        } catch {
            // cross-origin
        }
    }

    const source = "pt";
    const cookieValue = `/${source}/${lang}`;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `googtrans=${cookieValue};expires=${expires.toUTCString()};path=/;`;
    setTimeout(() => location.reload(), 150);
}
