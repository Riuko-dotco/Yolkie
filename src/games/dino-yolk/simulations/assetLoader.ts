export interface LoadedImage {
    image: HTMLImageElement;
    width: number;
    height: number;
}

export function loadImage(path: string): Promise<LoadedImage> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            resolve({
                image,
                width: image.naturalWidth,
                height: image.naturalHeight
            });
        };

        image.onerror = () => {
            reject(new Error(`No se pudo cargar la imagen: ${path}`));
        };

        image.src = chrome.runtime.getURL(path);
    });
}