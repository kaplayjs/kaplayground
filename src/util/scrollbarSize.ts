const scrollbarSizes: Record<string, number | null> = {
    width: null,
    height: null,
    widthThin: null,
    heightThin: null,
};

const getScrollbarSizes = (key: keyof typeof scrollbarSizes): number => {
    if (scrollbarSizes[key] !== null) return scrollbarSizes[key];

    const div = document.createElement("div");
    div.style.cssText =
        "position: absolute; visibility: hidden; overflow: scroll";

    document.body.appendChild(div);

    scrollbarSizes.width = div.offsetWidth - div.clientWidth;
    scrollbarSizes.height = div.offsetHeight - div.clientHeight;

    div.style.scrollbarWidth = "thin";
    scrollbarSizes.widthThin = div.offsetWidth - div.clientWidth;
    scrollbarSizes.heightThin = div.offsetHeight - div.clientHeight;

    document.body.removeChild(div);

    return scrollbarSizes[key] ?? 0;
};

export const scrollbarSize = () => ({
    scrollbarWidth: () => getScrollbarSizes("width"),
    scrollbarHeight: () => getScrollbarSizes("height"),
    scrollbarThinWidth: () => getScrollbarSizes("widthThin"),
    scrollbarThinHeight: () => getScrollbarSizes("heightThin"),
});
