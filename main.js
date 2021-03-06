
const video = document.querySelector('#video')
function play() {
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            video.srcObject = stream
        })
    }

}

Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('weights'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('weights'),
    faceapi.nets.mtcnn.loadFromUri('weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('weights'),
    faceapi.nets.tinyFaceDetector.loadFromUri('weights'),
]).then(play)


video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.appendChild(canvas)

    const displaySize = {
        width: canvas.width,
        height: canvas.height
    }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.mtcnn(video)
        // .withFaceLandmarks()
        // console.log(detections)
        const detectionsWithExpressions = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const resizedExpression = faceapi.resizeResults(detectionsWithExpressions, displaySize)
        // console.log(resizedDetections)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedExpression)
    }, 100)

})