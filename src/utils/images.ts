// TODO: Add support for gifs

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  callback: ({ file, dataURL }: { file: File; dataURL: string }) => void
) => {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target?.result as string;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Calculate the new dimensions while maintaining the aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // Set the canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the image on the canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert the canvas content to a data URL
      const resizedImage = canvas.toDataURL("image/jpeg");
      const newFileName = file.name.toString().replace(/(png|jpeg|jpg|webp)$/i, "jpeg");

      const newFile = b64toFile(resizedImage, newFileName);
      // Execute the callback with the resized image data URL
      callback({ file: newFile, dataURL: URL.createObjectURL(newFile) });
    };
  };

  reader.readAsDataURL(file);
};

const b64toFile = (b64Data: string, fileName: string): File => {
  const byteArrays = b64toByteArrays(b64Data);
  const file = new File(byteArrays, fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
  return file;
};

const b64toByteArrays = (b64Data: string): Uint8Array[] => {
  const sliceSize = 512;

  const byteCharacters = atob(
    b64Data.toString().replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "")
  );
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  return byteArrays;
};
