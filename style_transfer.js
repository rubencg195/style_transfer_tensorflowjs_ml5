
let inputImg;
let statusMsg;
let transferBtn;
var style1;
var style2;
var style3;
var style4;
var style5;

var styleSelected = null;
var modelsReady = false;

var width = 350;
var height = 350;

var limit_width = 350;
var limit_height = 350;

$("#widthInput").val(width);
$("#heightInput").val(height);


async function uploadRefImage(e) {
  //Upload Image
  const imgFile = $(imgInputId).get(0).files[0];
  if (!imgFile) {
    return;
  }
  //Show Loader
  $(loaderTab1Id).show();
  $(loaderTextTab1Id).html("Uploading Image...");
  const img = await faceapi.bufferToImage(imgFile);
  $(imgTab1Id).get(0).src = img.src;
  console.log("Uploading Content");

  $(imgContainerId).show();
  //Write the results on screen
  transferImages();
}

function resizeImage(image, width, height) {
  return new Promise((resolve, reject) => {
    var img_width = image.clientWidth;
    var img_height = image.clientHeight;

    if(img_width > limit_width  || img_height > limit_height ){
      console.log(`${img_width}x${img_height} Bigger than limit ${limit_width}x${limit_height}`);
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      // Scale and draw the source image to the canvas
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
      // Convert the canvas to a data URL in PNG format
      var newImage = new Image();
      newImage.src = canvas.toDataURL();
      return resolve(newImage);
    }else{
      console.log(`${img_width}x${img_height} Below limit ${limit_width}x${limit_height}`);
      return resolve(image);
    }
  });
}

$("#transferBtn").click(() => transferImages());
$("#widthInput").change(()=>{
  width = parseInt($("#widthInput").val() );
  transferImages();
});
$("#heightInput").change(()=>{
  height = parseInt($("#heightInput").val() );
  transferImages();
});
$("#styleSelect").change(() => {

  var styleSelectedValue = $('#styleSelect').val();
  var styleTitle = "";
  var styleDescriptionURL = "";
  var styleImageURL = "";
  switch (styleSelectedValue) {
    case "1":
      console.log("Wave Style");
      styleTitle = "The Great Wave off Kanagawa, 1829 - Katsushika Hokusai";
      styleDescriptionURL = "https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa";
      styleImageURL = "wave.jpg";
      break;
    case "2":
      console.log("Udnie Style");
      styleTitle = "Udnie (Young American Girl, The Dance), 1913 - Francis Picabia";
      styleDescriptionURL = "https://en.wikipedia.org/wiki/Francis_Picabia";
      styleImageURL = "udnie.jpg";
      break;
    case "3":
      console.log("Mathura Style");
      styleTitle = "Doodle Maps - Mahura";
      styleDescriptionURL = "https://mathuramg.com/fineArt.html";
      styleImageURL = "mathura.jpg";
      break;
    case "4":
      console.log("Scream Style");
      styleTitle = "The Scream, 1893 by Edvard Munch";
      styleDescriptionURL = "https://www.edvardmunch.org/the-scream.jsp";
      styleImageURL = "scream.jpg";
      break;
    case "5":
      console.log("Matta Style");
      styleTitle = "Matta: On the Edge of a Dream";
      styleDescriptionURL = "http://www.artnet.com/artists/roberto-matta/on-the-edge-of-a-dream-a-N7XykICJ-_evhKkMbU47rQ2";
      styleImageURL = "matta.jpg";
      break;
  }
  $("#styleTitle").html(styleTitle);
  $("#styleTitle").attr("href", styleDescriptionURL);
  $("#styleImageURL").attr("src", styleImageURL);
  transferImages();
});

function setupStyleTransfer() {
  // Create two Style methods with different pre-trained models
  style1 = ml5.styleTransfer('https://rubencg195.github.io/pages/style-transfer/models/wave', modelLoaded);
  style2 = ml5.styleTransfer('https://rubencg195.github.io/pages/style-transfer/models/udnie', modelLoaded);
  style3 = ml5.styleTransfer('https://rubencg195.github.io/pages/style-transfer/models/mathura', modelLoaded);
  style4 = ml5.styleTransfer('https://rubencg195.github.io/pages/style-transfer/models/scream', modelLoaded);
  style5 = ml5.styleTransfer('https://rubencg195.github.io/pages/style-transfer/models/matta', modelLoaded);
}

// A function to be called when the models have loaded
async function modelLoaded() {
  // Check if both models are loaded
  if (style1.ready && style2.ready  && style3.ready  && style4.ready  && style5.ready && !modelsReady) {
    // statusMsg.html('Ready!')
    $(loaderTab1Id).hide();
    $(tab1Id).show();
    $(tab2Id).show();
    $(tabContainerNav).show();
    $(tabContainer).show();
    modelsReady = true;
    console.log("All models ready");
    transferImages();
  }
}

// Apply the transfer to both images!
async function transferImages() {
 
  $(loaderTab1Id).show();
  $(loaderTextTab1Id).html("Applying Style Transfer...");
  $("#outputImage").empty();
  await new Promise(resolve => setTimeout(resolve, 100));

  var styleSelectedValue = $('#styleSelect').val();
  switch (styleSelectedValue) {
    case "1":
      styleSelected = style1;
      break;
    case "2":
      styleSelected = style2;
      break;
    case "3":
      styleSelected = style3;
      break;
    case "4":
      styleSelected = style4;
      break;
    case "5":
      styleSelected = style5;
      break;
  }
  let image = await resizeImage( $("#refImg").get(0) , width, height);
  // console.log( "image resize" , Object.assign({}, image) );
  // styleSelected.transfer( $("#refImg").get(0) , function (err, result) {
  //   $('#outputImage').prepend(`<img id="styledImage" width="100%" src="${result.src}" />`);
  //   $(loaderTab1Id).hide();
  // });
  styleSelected.transfer( image , function (err, result) {
    if(err){
      $(loaderTab1Id).show();
      $(loaderTextTab1Id).html(`ERROR: ${err}\nTry a smaller image...`);
    }else{
      $('#outputImage').prepend(`<img id="styledImage" width="100%" src="${result.src}" />`);
      $(loaderTab1Id).hide();
    }
  });
}