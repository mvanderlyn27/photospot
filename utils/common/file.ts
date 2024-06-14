const getUrlName = (url: string) => {
    return url.split("/").pop();
}
export const imageToFile = async (imgUrl: string, nameSuffix?: string) => {
    // let imgName = getUrlName(imgUrl);
    // if(nameSuffix){
    // imgName +=nameSuffix
    // }
    // if (!imgName) {
    // imgName = "image.png"
    // }

    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const file = new File([blob], imgUrl, {
        type: blob.type,
    });
    return file;
}