// lib/googleTranslate.tsx
"use client";
import { useEffect } from "react";

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        // opcional: expõe função global para debug/uso direto
        __gt_changeLanguage?: (lang: string) => void;
    }
}

/**
 * Wrapper React que injeta o script do Google Translate.
 * Use no seu layout (por exemplo em layout.tsx) para garantir que o widget seja carregado.
 */
export function GoogleTranslateWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // init function exigida pelo script do Google
        window.googleTranslateElementInit = () => {
            try {
                new (window as any).google.translate.TranslateElement(
                    { pageLanguage: "pt", includedLanguages: "pt,en,es", layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
                    "google_translate_element"
                );
            } catch (e) {
                // silent
            }
        };

        // adiciona o script do Google (se já não existir)
        if (!document.querySelector('script[src*="translate_a/element.js"]')) {
            const s = document.createElement("script");
            s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            s.async = true;
            document.body.appendChild(s);
        }

        // opcional: expõe função global para facilitar chamadas externas
        window.__gt_changeLanguage = (lang: string) => {
            tryChangeLanguage(lang);
        };

        return () => {
            // cleanup mínimo (não removemos o script para não quebrar recarregamentos)
        };
    }, []);

    return (
        <>
            {/* Google injeta o markup aqui */}
            <div id="google_translate_element" style={{ display: "none" }} />
            {children}
        </>
    );
}

/**
 * Função pública que você chama na Navbar.
 * Tenta 3 estratégias (select, iframe click, cookie+reload).
 */
export function changeLanguage(lang: string) {
    if (typeof window === "undefined") return;

    // 1) tentar o select (mais limpo)
    const trySelect = (): boolean => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event("change"));
            return true;
        }
        return false;
    };

    // 2) tentar clicar no item dentro do iframe do menu (pode ser bloqueado por cross-origin)
    const tryIframeClick = (): boolean => {
        const menuIframe = document.querySelector('iframe.goog-te-menu-frame, iframe.goog-te-menu');
        if (!menuIframe) return false;
        try {
            const doc = (menuIframe as HTMLIFrameElement).contentDocument || (menuIframe as HTMLIFrameElement).contentWindow?.document;
            if (!doc) return false;
            // procura link pelo atributo 'lang' (às vezes existe)
            const link = doc.querySelector<HTMLElement>(`a[lang="${lang}"], a[hreflang="${lang}"]`);
            if (link) {
                link.click();
                return true;
            }
        } catch (e) {
            // acesso cross-origin provavelmente - falha silenciosa
        }
        return false;
    };

    // 3) fallback robusto: setar cookie googtrans e recarregar.
    const setCookieAndReload = () => {
        const source = "pt"; // sua língua base
        const cookieValue = `/${source}/${lang}`;
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        const cookie = `googtrans=${cookieValue};expires=${expires.toUTCString()};path=/;`;

        // tentar setar com e sem domínio (localhost não aceita domain)
        try {
            const hostname = location.hostname;
            if (hostname !== "localhost" && hostname !== "") {
                document.cookie = cookie + `domain=.${hostname};`;
            }
        } catch (e) {
            // ignora
        }
        // sempre setar sem domain também
        document.cookie = cookie;

        // pequena espera para garantir que cookie seja gravado
        setTimeout(() => {
            location.reload();
        }, 150);
    };

    // execução em ordem
    if (trySelect()) return;
    if (tryIframeClick()) return;
    // se chegou aqui, usa cookie + reload
    setCookieAndReload();
}

/**
 * Função interna usada pelo wrapper também caso queira
 */
function tryChangeLanguage(lang: string) {
    // mesma lógica interna (copiada para o `window.__gt_changeLanguage`)
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        return;
    }

    // tenta iframe (pode falhar)
    const menuIframe = document.querySelector('iframe.goog-te-menu-frame, iframe.goog-te-menu');
    if (menuIframe) {
        try {
            const doc = (menuIframe as HTMLIFrameElement).contentDocument || (menuIframe as HTMLIFrameElement).contentWindow?.document;
            const link = doc?.querySelector<HTMLElement>(`a[lang="${lang}"], a[hreflang="${lang}"]`);
            if (link) {
                link.click();
                return;
            }
        } catch (e) {
            // cross origin
        }
    }

    // fallback cookie+reload
    const source = "pt";
    const cookieValue = `/${source}/${lang}`;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `googtrans=${cookieValue};expires=${expires.toUTCString()};path=/;`;
    setTimeout(() => location.reload(), 150);
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Cria o observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node instanceof HTMLIFrameElement &&
                        node.id === ":2.container"
                    ) {
                        node.remove();
                        console.log("iframe :2.container removido!");
                    }
                });
            });
        });

        // Observa alterações no body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup ao desmontar
        return () => observer.disconnect();
    }, []);




}
