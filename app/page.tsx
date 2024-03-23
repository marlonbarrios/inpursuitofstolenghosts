'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as fal from "@fal-ai/serverless-client";
import Image from 'next/image';
import P5Block from './p5block'; // Make sure this path matches the location of your P5Block component

fal.config({
  proxyUrl: "/api/fal/proxy",
});

//const seed = 110602490;
const seed = Math.floor(Math.random() * 100000);

export default function Home() {
  const [input, setInput] = useState('human form, human body of different genders, ages and sizes,  aztec, mayan, yanomami, NOIR,  african, entangled with oil bubbles like hanging from heaven, inner lights,  blood, fire, network of tendrils, veins, umbilical cords, strange colors, abstract, complexity, organic, emerging organic, growth, black hole, metapatterns, phyllotaxis, diatoms, texture, voronoi, and depth, forces, photo-realistic');
  // const [input, setInput] = useState('3D, balck background, dramatic light, complex system, liquid light, hight dimensional spaces, non euclidian, meta abstraction,  blackhole,  internal sun neuron, morphing black and white, networks');
  const [strength, setStrength] = useState(0.75);
  const [image, setImage] = useState(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [audioSrc, setAudioSrc] = useState('/ghost_stolen.mp3');

  useEffect(() => { setIsClient(true) }, []);

  const { send } = fal.realtime.connect('110602490-sdxl-turbo-realtime', {
    connectionKey: 'fal-ai/fast-lightning-sdxl',
    onResult(result) {
      if (result.error) return;
      setImage(result.images[0].url);
    }
  });

  const captureAndSendImage = useCallback(async () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const image_url = canvas.toDataURL();
      send({
        sync_mode: true,
        strength: strength,
        seed: seed,
        prompt: input,
        image_url: image_url
      });
    }
  }, [strength, input, send]); // captureAndSendImage's dependencies

  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        captureAndSendImage();
      }, 10); // Automatically capture and send image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isClient, captureAndSendImage]); // useEffect's dependencies, including captureAndSendImage

  return (
  
    <main className="p-12" >
       <div className="audio-player my-4">  <p className="text-xl mb-2">en busca de los fantasmas robados | in pursuit of stolen ghosts</p>
      <audio controls src={audioSrc} loop>
          Your browser does not support the audio element.
        </audio>
      </div>
     
      
     
      {/* <input
        className='border rounded-lg p-2 w-full mb-2'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> */}
      <div className="mb-4">
        {/* <label htmlFor="strengthSlider" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Strength: {strength}</label> */}
        {/* <input
          id="strengthSlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={strength}
          onChange={(e) => setStrength(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        /> */}
      </div>
      <div className='flex'>
        <div className="w-[600px] h-[600px]">
          {isClient && <P5Block />}
        </div>
        {image && (
          <Image
            src={image}
            width={600}
            height={600}
            alt='Generated Image'
          />
        )}
      </div>
    
      <div className="mb-4">
      <p className="text-xl mb-2">play sound,  press spacebar to reset the canvas and move the mouse to draw and interact with the generative design and AI.</p>
      <p className="text-xl mb-2">concept, generative design, programming and music by <a href="https://linktr.ee/marlonbarriososolano" target="_blank">Marlon Barrios Solano</a></p></div>
       
      
    </main>
  );
}
