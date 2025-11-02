import { rm } from "../../../lib/dom";
import { mkRuleClass } from "../template";

export const asianfanfics = () =>
    mkRuleClass({
        bookUrl: document.location.href,
        bookname:(
            document.querySelector("#story-title") as HTMLElement
        ).innerText.trim(),
        author:(
            document.querySelector('a[href*="/profile/u/"]') as HTMLAnchorElement
        ).innerText.trim(),
        introDom: document.querySelector("#story-description") as HTMLElement,
        introDomPatch: (dom) => dom,
        coverUrl: undefined,
        additionalMetadatePatch: undefined,
        aList: document.querySelectorAll(".widget--chapters__forward-link a, .widget__accordion a"),
        getAName: (aElem) => (aElem as HTMLElement).innerText.trim(),
        sections: undefined,
        getSName: undefined,
        getContent: (doc) => (doc.querySelector("#user-submitted-body") ||
                doc.querySelector("#story-forward")),
        contentPatch: (content) => {
            rm("span", true, content);
            return content;
        },
        language: "zh",
    });
