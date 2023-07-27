import React, { useRef } from 'react';

const ImageCompressor = ({ maxSizeInMB, onCompressed }) => {
  const inputRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file, maxSizeInMB);
      onCompressed(compressedFile);
      inputRef.current.value = ''; // Clear the input value after compression
    } catch (error) {
      console.error('Image compression error:', error);
    }
  };

  const compressImage = async (file, maxSizeInMB) => {
    const image = new Image();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
          let width = image.width;
          let height = image.height;
          let compression = 0.9; // Initial compression quality

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          while (compressImageSize(canvas.toDataURL('image/jpeg', compression)) > maxSizeInBytes) {
            // Reduce the compression quality until the image size is below the target limit
            compression -= 0.1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, width, height);
          }

          const compressedDataURL = canvas.toDataURL('image/jpeg', compression);
          const compressedFile = dataURLtoFile(compressedDataURL, file.name);
          resolve(compressedFile);
        };
        image.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImageSize = (dataURL) => {
    // Convert dataURL to Blob to get its size in bytes
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: mimeString });
    return blob.size;
  };

  const dataURLtoFile = (dataURL, fileName) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };
  return (
    <div>
      <input type="file" id="image1" accept="image/*" ref={inputRef} onChange={handleImageChange}/>
    </div>
  );
};

export default ImageCompressor;
