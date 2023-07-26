import ImageCrop from "./ImageCrop"
import './App.css';
import { useState } from 'react';
import ImageCompressor from "./ImageCompressor";

function App() {
  const [images,setImages]=useState(null);
  const[newUrl,setNewUrl]=useState(null);
  const[file,setFile]=useState('');

  const onCancel=()=>{
    setImages(null);
}
const handelchange=async(e)=>{
  console.log(e.target.files[0])
  setImages(URL.createObjectURL(e.target.files[0]));
}
const setCroppedImageFor=(croppedImageUrl)=>{
  setNewUrl(croppedImageUrl)
  onCancel()
  console.log(newUrl)
}
const clicked=()=>{
setFile("");
}
const handleCompressedImage = (compressedImage) => {
  const url=URL.createObjectURL(compressedImage);
  // console.log(url);
  setNewUrl(url);
};
  return (
    <div className="App">
      {images&&<ImageCrop onCancel={onCancel} setCroppedImageFor={setCroppedImageFor} image={images}/>}
      <div className='image-card'>
      {images&&<img src={images}
      initCrop={images.crop}
      initAspect={images.aspect}
      initZoom={images.zoom}
      />}
      </div>
      <h1>Image Cropper</h1>
      <input type="file" accept="image/" name="image" id="image" value={file} onChange={handelchange} onClick={clicked}/>
      <h1>Image Compressor</h1>
      <ImageCompressor maxSizeInMB={5} onCompressed={handleCompressedImage}/>
      <div className='image-card'>
      {newUrl&&<img src={newUrl}
      alt="img"
      />}
    </div>
    </div>
  );
}

export default App;
