//https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
//https://github.com/mishig25/3d-posenet
const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/'
const useTinyModel = false
const minConfidence = 0.45;
const imgContainerId = "#imageContainer";
const imgInputId = "#refImgUploadInput";
const imgTab1Id = '#refImg';
const imgTab1OverlayId = '#refImgOverlay';
const videoTab2Id = "";
const tabContainerNav = "#TabsContainerNav";
const tabContainer = "#TabsContainer";

const minPoseConfidence= 0.1;
const minPartConfidence= 0.5;

const tab1Id = '#Tab1';
const tab2Id = '#Tab2';
const loaderTab1Id = '#loadingTab1';
const loaderTab2Id = '#loadingTab2';
const loaderTextTab1Id = '#loadingTextTab1';
const videoEl_1 = '#inputVideo';
const videoEl_2 = '#inputVideo2';
const imageScaleFactor = 0.50; //What to scale the image by before feeding it through the network. Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
const flipHorizontal = false;
const outputStride = 8// 16; // The higher the number, the faster the performance but slower the accuracy, and visa versa.
// get up to 5 poses
const maxPoseDetections = 5;
// minimum confidence of the root part of a pose
const scoreThreshold = 0.5;
const partScoreThreshold = 0.4;
// minimum distance in pixels between the root parts of poses
const nmsRadius = 20;
const color = 'green';
const colorCode = '#66ff33';
const boundingBoxColor = 'red';
const lineWidth = 2;
var net = null;
var poses = null;

$(document).ready(function () {
    loadModels();
    setupStyleTransfer();
});
$(window).resize(function () {
    // updateReferenceImageResults();
});
function downloadResume() {
    window.open("https://rubencg195.github.io/RubenChevezCV.pdf", '_blank');
}
async function loadModels() {
    console.log("Loading ML Models");
    //Show Loaders while the models are loaded
    $(loaderTab1Id).show();
    $(loaderTab2Id).show();
    $(loaderTextTab1Id).html("Loading Machine Learning Models...");
    //Hide Tabs Content
    $(tab1Id).hide();
    $(tab2Id).hide();
    $(tabContainerNav).hide();
    $(tabContainer).hide();

    // net = await posenet.load();

    //Show Content
    $(imgTab1Id).get(0).src = testImg;
    // $(loaderTab1Id).hide();
    // $(tab1Id).show();
    // $(tab2Id).show();
    // $(tabContainerNav).show();
    // $(tabContainer).show();
    // $(loaderTab1Id).show();
    // $(loaderTextTab1Id).html("Recognizing Pose...");
    // await new Promise(resolve => setTimeout(resolve, 500));
    // updateReferenceImageResults();
}
const testImg = `data:image/jpeg;base64,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`;