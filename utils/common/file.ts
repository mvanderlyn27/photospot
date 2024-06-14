export const toDataURL = async (url: string) => {
    const dataBlob = await fetch(url).then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)

        }))
};



export function dataURLtoFile(dataurl: string, filename: string) {
    let arr = dataurl.split(',');
    const matchResult = arr[0]?.match(/:(.*?);/);
    let mime = ''
    if (matchResult && matchResult.length > 1) {
        mime = matchResult[1];
    }
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
const getUrlName = (url: string) => {
    return url.split("/").pop();
}
export const imageToFile = async (imgUrl: string) => {
    var imgName = getUrlName(imgUrl);
    if (!imgName) {
        imgName = "image.png"
    }

    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const file = new File([blob], imgName, {
        type: blob.type,
    });
    return file;
}