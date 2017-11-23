function ditherKernel(name, kernel){
  this.Name = name;
  this.Kernel = kernel;
}

var source, big;
var radialGrad = false, RG, isRG, startValue = 60 * 60 * 10, idleCounter = startValue, colorCount1, colorCount2, c1 = 155, c2 = 200;
var scaleFactor = 10;
var posX, posY, prevVal1, prevVal2, prevFac, prevLev, prevPixSize = 0, isBW = false;
var posMouseX, posMouseY;
var input, button, saveTxt, changeKernel, genDither, slider1, slider2, pixSize, slidFac, slidLev, BW;
var ker = [];
var fac = 16, lev = 1;
var ditherKernels = [];
var kernelName = ['STEINBERG', 'LINEARRANDOM', 'FALSESTEINBERG', 'PARTIALBURKE', 'INVERTEDSTEINBERG',
'SLANTED', 'COOL01', 'COOL02', 'COOL03', 'COOL04', 'COOL05', 'COOL06', 'CHRIS', 'STRUCTURE'];
var STEINBERG = [[0.0, 0.0, 0.0 ], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
var LINEARRANDOM = [[0, 3.0, 0], [ 5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
var FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
var PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
var INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
var SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
var COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
var COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [ 7.0, 0, 0]];///cool 2 3
var COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
var COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
var COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
var COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
var CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
var STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
var kernels = [STEINBERG, LINEARRANDOM, FALSESTEINBERG, PARTIALBURKE, INVERTEDSTEINBERG,
SLANTED, COOL01, COOL02, COOL03, COOL04, COOL05, COOL06, CHRIS, STRUCTURE];
var di;
var childDither = false;
ker = STEINBERG;
function setup(){
 pixelDensity(1);
 var w = floor(window.innerWidth / 10) * 10;
 var h = floor(window.innerHeight / 10) * 10;
 var cnv = createCanvas(w, h);
 posX = abs((window.innerWidth / 2) - (width / 2));
 posY = 0;
 cnv.position(posX, posY);
   ////creating the array with the kernels
   for(var i = 0; i < kernels.length; i++){
    var ditKer = new ditherKernel(kernelName[i], kernels[i]);
    ditherKernels.push(ditKer);
  }
  BW = createButton('BW');
  BW.mousePressed(blackAndWhite);
  BW.position(width - 237 , posY + 5);
   //radial button
   RG = createButton('ARTEM');
   RG.mousePressed(makeRadialGradient);
   RG.position(BW.x + BW.width + 15, BW.y);
   ////image init 
   source = createImage(floor(width / scaleFactor), floor(height / scaleFactor));
   di = new ditherImage(0, 0, w, h, true, source);
   updateValue();
   // generateDither();
   colorCount1 = floor(random(3));
   colorCount2 = floor(random(3));
   //console.log(slider1.value(), slider2.value(), prevVal1, prevVal2);
 }

 function draw(){
  if(idleCounter <= 0){
    idleCounter = 0;
    if(frameCount % 60 == 0)idleMode(colorCount1, colorCount2);
  }
  idleCounter --;
}
//save image function
function saveImg() {
  di.saveImg(input.value(), col1, col2, scaleFactor, fac, lev, ker, radialGrad);
}
function blackAndWhite(){
  idleCounter = startValue;//reset the idlecounter to exit idleMode
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
  isBW = !isBW;
  let val1 = floor(document.getElementById("color1").value);
  let val2 = floor(document.getElementById("color2").value);
  console.log(val1, val2);
  if(isBW){
    col1 = color(val1);
    col2 = color(val2);
  }else{
    colorMode(HSB);
    col1 = color(val1, 100, 100);
    col2 = color(val2, 100, 100);
    colorMode(RGB);
  }
  generateDither();
}

function makeRadialGradient(){
  idleCounter = startValue;//reset the idlecounter to exit idleMode
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
  radialGrad = !radialGrad;
  di.update(col1, col2, fac, lev, ker, scaleFactor, radialGrad);
  di.show();
}

function idleMode(num1, num2){
  //add random kernel
  //and let the timing be 10 min or check with boris
  console.log('idle')
  scaleFactor = 10;
  c1 -= colorCount1;
  c2 += colorCount2;
  if(isBW){ 
    col1 = color(c1 % 255);
    col2 = color(c2 % 255);
  }else{
    colorMode(HSB);
    col1 = color(c1 % 255, 100, 100);
    col2 = color(c2 % 255, 100, 100);
    colorMode(RGB);
  }
  generateDither();
}

function personalDither(){
  console.log('go');
  var matrix = [];
  var i = 1
  for (var y =  0; y < 3; y++) {
    matrix[y] = [];
    for (var x = 0; x < 3; x++) {
      var matrixVal = document.getElementById("k" + i).value;
      if(isNaN(matrixVal) || matrixVal == '') matrixVal = floor(random(100));
      else matrixVal = parseInt(matrixVal);
      matrix[y][x] = matrixVal;
      //matrix.push(matrixVal);
      i++;
    }
  }
  ker = matrix;
  generateDither();
  //console.log(matrix);
}
//////
function whichKernel(){
  var select = document.getElementById("kernel");
  var answer = select.options[select.selectedIndex].value;
  if(ditherKernels != null){
    for(var i = 0; i < ditherKernels.length; i++){
      if(answer == ditherKernels[i].Name){
        ker = ditherKernels[i].Kernel;
        break;
      }
    }
  }
  generateDither();
  //console.log(answer);
}

function generateDither(){
    //console.log(di);
    di.update(col1, col2, fac, lev, ker, scaleFactor, radialGrad);
    di.show();
  }

  function updateValue(){  
    scaleFactor = floor(document.getElementById("pixSize").value);
    let val1 = floor(document.getElementById("color1").value);
    let val2 = floor(document.getElementById("color2").value);
    if(isBW){
      col1 = color(val1);
      col2 = color(val2);
    }else{
      colorMode(HSB);
      col1 = color(val1, 100, 100);
      col2 = color(val2, 100, 100);
      colorMode(RGB);
    }
    fac = document.getElementById("factor").value;
    generateDither();
    idleCounter = startValue;//reset the idlecounter to exit idleMode
    colorCount1 = floor(random(3));
    colorCount2 = floor(random(3));
  }

  function setPosition(){
    let items = document.getElementsByClassName("ditinput");
    for(let i = 0; i < items.length; i++){
      items[i].style.left = width - 240 + "px";
    }    
    let sliders = document.getElementsByClassName("sliders");
    for(let i = 0; i < sliders.length; i++){
      sliders[i].style.left = (width - 240) + "px";
    }
    let elements = document.getElementsByClassName("kernels");
    for(let i = 0; i < elements.length; i++){
      elements[i].style.left = (width - 237)+ "px";
    }
    let info = document.getElementsByClassName("infobtn");
    for(let i = 0; i < info.length; i++){
      info[i].style.left = (width - 235)+ "px";
    }
  }