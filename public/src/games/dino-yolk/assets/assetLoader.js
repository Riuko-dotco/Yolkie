/**
 * @param {string} path
 */
export function loadImage(path) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            resolve({
                image,
                width: image.naturalWidth,
                height: image.naturalHeight
            });
        };

        image.onerror = (error) => {
            reject(error);
        };

        image.src = chrome.runtime.getURL(path);
    });
}