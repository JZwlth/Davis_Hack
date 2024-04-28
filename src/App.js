// App.js

import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    async function openCamera(videoElement, controlsElement) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        controlsElement.style.display = 'flex';
      } catch (error) {
        console.error('Error accessing media devices', error);
      }
    }

    document.getElementById('enableVideo').addEventListener('click', () => {
      const video = document.getElementById('webcam');
      const videoTrack = video.srcObject.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    });

    document.getElementById('muteAudio').addEventListener('click', () => {
      const video = document.getElementById('webcam');
      const audioTrack = video.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    });

    document.getElementById('enableRemoteVideo').addEventListener('click', () => {
      const video = document.getElementById('remote-video');
      const videoTrack = video.srcObject.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    });

    document.getElementById('muteRemoteAudio').addEventListener('click', () => {
      const video = document.getElementById('remote-video');
      const audioTrack = video.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    });

    openCamera(document.getElementById('webcam'), document.querySelector('.controls:nth-child(1)'));
    openCamera(document.getElementById('remote-video'), document.querySelector('.controls:nth-child(2)'));
  }, []);

  return (
    <div>
      <nav className="navbar">
        <span className="text">Fachat</span>
      </nav>
      <div className="main-wrapper">
        <div className="video-container">
          <video id="webcam" width="480" height="360" autoPlay></video>
          <div className="controls">
            <button id="enableVideo" className="btn btn-primary"><i className="fa fa-video-camera"></i></button>
            <button id="muteAudio" className="btn btn-primary"><i className="fa fa-microphone"></i></button>
          </div>
        </div>
        <div className="video-container">
          <video id="remote-video" width="480" height="360" autoPlay></video>
          <div className="controls">
            <button id="enableRemoteVideo" className="btn btn-primary"><i className="fa fa-video-camera"></i></button>
            <button id="muteRemoteAudio" className="btn btn-primary"><i className="fa fa-microphone"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
