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