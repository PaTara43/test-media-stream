import { WHIPClient } from './whip-whep-js/whip.js'

window.addEventListener("DOMContentLoaded", async function() {

    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        video = document.querySelector('video'),
        videostream = document.querySelector('#videostream'),
        videoObj = {
            video: {
                width: 400,
                height: 250,
                require: ['width', 'height']
            }
        }
    ;

    navigator.mediaDevices.getUserMedia(videoObj).then((stream) => {
        let streamtest;
        video.srcObject = stream;
        video.onplay = async function() {
            streamtest = canvas.captureStream();
            videostream.srcObject = streamtest;
            console.log('streamtest check', streamtest);
            console.log('streamtest.getVideoTracks()[0]', streamtest?.getVideoTracks()[0]);
            streamtest.getTracks().forEach((track) => console.log('track', track));
            // Create peer connection
            const pc = new RTCPeerConnection({ bundlePolicy: "max-bundle" });

            //Send all tracks
            for (const track of streamtest.getTracks()) {
                pc.addTransceiver(track, { direction: 'sendonly' });
            }

            // Create WHIP client
            const whip = new WHIPClient();
            //const url = "https://video.multi-agent.io/api/webrtc?dst=browser";
            const url = "http://localhost/go2rtc/api/webrtc?dst=browser"; // Replace with your WHIP endpoint

            // Start publishing
            await whip.publish(pc, url);
            console.log("Streaming started successfully!");

            };



        // console.log(video.srcObject, videostream.srcObject, streamtest, streamtest.getVideoTracks()[0]);


        // video.crossOrigin = "Anonymous";
        // img.crossOrigin = "Anonymous";

        requestAnimationFrame(drawcanvas);


    }).catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    function drawcanvas(){

        const img = new Image();
        img.src = './robo.gif';
        img.onload = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            context.drawImage(img, 10, 10, 40, 40);
        };

        requestAnimationFrame(drawcanvas);
    }

}, false);