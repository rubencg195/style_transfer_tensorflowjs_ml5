// A function to draw ellipses over the detected keypoints
function drawKeypoints(ctx) {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      for (let j = 0; j < poses[i].keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = poses[i].keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (poses[i].score > minPoseConfidence) {
          // fill(255, 0, 0);
          // noStroke();
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          drawCoordinates(ctx, keypoint.position.x, keypoint.position.y);
        }
      }
      drawSkeleton(poses[i].keypoints, partScoreThreshold, ctx, scale = 1)
    }
  }
  function drawCoordinates(ctx, x, y) {
    var pointSize = 10; // Change according to the size of the point.
    ctx.fillStyle = colorCode; //"#ff2626"; // Red color
    ctx.beginPath(); //Start path
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
  }
  function toTuple({ y, x }) {
    return [y, x];
  }
  function drawSkeleton(keypoints, minPartConfidence, ctx, scale = 1) {
    const adjacentKeyPoints =
      posenet.getAdjacentKeyPoints(keypoints, minPartConfidence);
    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
        scale, ctx);
    });
  }
  function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }