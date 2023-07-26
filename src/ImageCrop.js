import React from 'react'
import { useState} from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropeImage';

const aspectRatio=[
    {value:4/3,text:"4/3"},
    {value:2/1,text:"2/1"},
    {value:3/5,text:"3/5"}
]
 const ImageCrop=({image,initCrop,initAspect,initZoom,onCancel,setCroppedImageFor,}) =>{
    if(initZoom == null){
        initZoom=1;
    }
    if(initCrop == null){
        initCrop={x:0,y:0};
    }
    if(initAspect==null){
        initAspect=aspectRatio[0];
    }

    const [zoom,setZoom]=useState(initZoom);
    const [crop,setCrop]=useState(initCrop);
    const [aspect,setAspect]=useState(initAspect);
    const [croppedAreaPixels,SetCroppedAreaPixels]=useState(null);


    const oncrop=(crop)=>{
        setCrop(crop);
    };
    const onzoom=(zoom)=>{
        setZoom(zoom);
    }
    const onAspect=(e)=>{
        const value=e.target.value;
        const ratio =aspectRatio.find(ratio=> ratio.value==value)
        setAspect(ratio);
    }
    const oncomplete=(croppedArea,croppedAreaPixels)=>{
        SetCroppedAreaPixels(croppedAreaPixels);
    }
    const onCropclick=async()=>{
        const croppedImageUrl=await getCroppedImg(image,croppedAreaPixels);
        setCroppedImageFor(croppedImageUrl)
    };
   
  return (
    <div>
      <div className='backdrop'></div>
      <div className="crop-container">
        <Cropper 
        image={image}
        zoom={zoom}
        crop={crop}
        aspect={aspect.value}
        onCropChange={oncrop}
        onZoomChange={onzoom}
        onCropComplete={oncomplete}
        />
      </div>
      <div className='controls'>
        <div className="controls-upper-area">
      <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e) => {
              onzoom(e.target.value);
            }}
            className="slider"
          />
        <select onChange={onAspect}>
            {aspectRatio.map(ratio=><option key={ratio.text} value={ratio.value} selected={ratio.value===aspect.value}>
                {ratio.text}
            </option>)}
        </select>
        </div>
        <div className='button-area'>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onCropclick}>Crop</button>
        </div>
      </div>
    </div>
  )
};
export default ImageCrop;