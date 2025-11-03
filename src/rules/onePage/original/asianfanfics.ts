import { getFrameContentEvent, getHtmlDOM } from "../../../lib/http";
import { mkRuleClass } from "../template";

// Unwrap element: remove tag but keep content
function unwrap(selector: string, dom: HTMLElement) {
    const elements = dom.querySelectorAll(selector);
    elements.forEach((el) => {
        const parent = el.parentNode;
        if (parent) {
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        }
    });
}

export const asianfanfics = () =>
    mkRuleClass({
        bookUrl: document.location.href,
        bookname: (
            document.querySelector("#story-title") as HTMLElement
        ).innerText.trim(),
        author: (
            document.querySelector('a[href*="/profile/u/"]') as HTMLAnchorElement
        ).innerText.trim(),
        introDom: document.querySelector("#story-description") as HTMLDivElement,
        introDomPatch: (dom) => {
            unwrap("span", dom);
            unwrap("h1, h2, h3, h4, h5, h6", dom);
            return dom;
        },
        coverUrl: null,
        additionalMetadatePatch: undefined,
        aList: document.querySelectorAll('.widget--chapters a[href*="/story/view/"]'),
        getAName: (aElem) => (aElem as HTMLElement).innerText.trim(),
        sections: undefined,
        getSName: undefined,
        getContentFromUrl: async (chapterUrl) => {
            const doc = await getFrameContentEvent(chapterUrl, 3000);
            if (!doc) {
                const fallbackDoc = await getHtmlDOM(chapterUrl);
                return (fallbackDoc.querySelector("#user-submitted-body") as HTMLElement | null) ??
                       (fallbackDoc.querySelector("#story-foreword") as HTMLElement | null);
            }
            
            const contentInIframe = (doc.querySelector("#user-submitted-body") as HTMLElement | null) ??
                                  (doc.querySelector("#story-foreword") as HTMLElement | null);
            
            if (!contentInIframe) {
                return null;
            }
            
            // Clone to main document context to avoid cross-document issues
            const content = document.createElement("div");
            content.innerHTML = contentInIframe.innerHTML;
            return content;
        },
        contentPatch: (content) => {
            unwrap("span", content);
            
            // Remove text-indent from all paragraphs
            const paragraphs = content.querySelectorAll("p");
            paragraphs.forEach((p) => {
                p.style.textIndent = "0";
            });
            
            return content;
        },
        language: "zh",
    });
