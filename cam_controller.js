var video_output_width = 100;
var video_output_height = 100;
var delay_ms =  50;

const inputConfig = {
  outputStride: 32,
  imageScaleFactor: 0.4,
  width: 800,
  height: 640,
};
const singlePoseDetectionConfig = {
  minPoseConfidence: 0.1,
  minPartConfidence: 0.5,
};
function loadCam(videoElId) {
  $(tab2Id).hide();
  $(loaderTab1Id).show();
  $(loaderTextTab1Id).html("Loading Camera...");
  const videoEl = $(videoElId).get(0);
  videoEl.width = inputConfig.width;
  videoEl.height = inputConfig.height;
  navigator.getUserMedia(
    { video: true },
    stream => {
      videoEl.srcObject = stream;
      console.log("Feed Element",videoEl.width, stream);
      console.log("Vid Element", $('#inputVideo').get(0).width);
      $(tab2Id).show();
      $(loaderTab1Id).hide();
    },
    err => {
      $(loaderTextTab1Id).html("Error Loading the Camera, Permission Denied...");
      console.error(err);
    }
  );
}
function vidToImage( _video ) {
  return new Promise(function (resolve, reject) {
    var _canvas = document.createElement("canvas");
    _canvas.width = video_output_width;
    _canvas.height = video_output_height;
    _canvas.getContext('2d')
        .drawImage( _video, 0, 0, video_output_width , video_output_height );
  
    var _img = new Image();
    _img.src = _canvas.toDataURL();
  
    return resolve(_img);
  });
}
let forwardTimes = []
function updateTimeStats(timeInMs) {
  forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
  const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
  $('#time').val(`${Math.round(avgTimeInMs)} ms`)
  $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
}
async function onPlay() {
  const imageElement = $('#inputVideo').get(0);
  const canvas = $('#refVideoOverlay').get(0);
  if (imageElement.paused || imageElement.ended)
    return setTimeout(() => onPlay());
  const ts = Date.now();
  let ctx = canvas.getContext("2d");
  updateTimeStats(Date.now() - ts);
  canvas.width = inputConfig.width;
  canvas.height = inputConfig.height;
  height = $('#inputVideo').height();
  let newVidImage = await vidToImage( imageElement )
  let videoStyleSelected = null;
  let videoStyleSelectedValue = $('#videoStyleSelect').val();
  switch (videoStyleSelectedValue) {
    case "1":
      videoStyleSelected = style1;
      break;
    case "2":
      videoStyleSelected = style2;
      break;
    case "3":
      videoStyleSelected = style3;
      break;
    case "4":
      videoStyleSelected = style4;
      break;
    case "5":
      videoStyleSelected = style5;
      break;
  }
  videoStyleSelected.transfer( newVidImage  , function (err, result) {
    if(err){
      $(loaderTab1Id).show();
      $(loaderTextTab1Id).html(`ERROR: ${err}\nTry a smaller image...`);
    }else{
      $('#videoOutput').html(`<img id="styledVideo" width="100%" src="${result.src}" />`);
      setTimeout(() => onPlay(), delay_ms );
      $(loaderTab1Id).hide();
    }
  });
}
