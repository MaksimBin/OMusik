
var elem = document.documentElement;

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

const tach = () => openFullscreen()

const startOMusik = () => {
  document.querySelector('.preloder').style = "display:none;"
  openFullscreen()
}


let getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

setInterval(() => {
  document.querySelector('.app').style = `
  box-shadow: ${getRandomArbitrary(-40, 40)}px 0 25px 1px red;
  transform: rotate(${getRandomArbitrary(-360, 360)}deg);
  `
  document.querySelector('.app2').style = `
    box-shadow: 15px ${getRandomArbitrary(-20, 20)}px 25px 1px rgb(255, 20, 147);
    transform: rotate(${getRandomArbitrary(-360, 360)}deg);
    `
   
    document.querySelector('.app3').style = `
    border-radius: ${getRandomArbitrary(-50, 50)}%;
    box-shadow: 0px 0px ${getRandomArbitrary(-50, 50)}px ${getRandomArbitrary(-50, 50)}px red;
    transform: rotate(${getRandomArbitrary(-360, 360)}deg);
    `
}, 3000)


let playLists = []

const showFile = (input) => {

  let files = input.files

  for (var i = 0; i < files.length; i++) {

    playLists.push(
    {
      "url": URL.createObjectURL(files[i]),
      "name": files[i].name
    })
  }

}

document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">&#10148;</div>`

let audio = new Audio()
let numberTrack = 0

let rengeAudio = 0
let ren = document.querySelector('.range')
ren.value = 0
ren.min = 0

const onCangeInput = (valueCange) => {
  audio.currentTime = Number(valueCange)
  rengeAudio = Number(valueCange)
}

let boolPause
let audioCurentTime

let interval

const audioPlay = () => {
  

  if (alertAudio()) {
    return
  }
  
  if (!boolPause) {
    ren.min = 0
    audio.duration = 0
  }
  
  audio = new Audio(playLists[numberTrack].url)
 
 if (boolPause) {
   audio.currentTime = audioCurentTime
 }

  document.querySelector('.PlayPause').innerHTML = ` <div style="transform: rotate(90deg);" onclick="stopAudio()">	&#61;</div>`
  
  audio.play()
  
  onload(audio)
  
  interval = setInterval(() => {

    rengeAudio = rengeAudio + 1

    ren.value = rengeAudio

    ren.max = getMax(audio.duration)
  
   audioCurentTime = audio.currentTime


    document.querySelector('.time').innerHTML = toTime(parseInt(audio.duration) - parseInt(audio.currentTime))
    
    
    if (toTime(parseInt(audio.duration) - parseInt(audio.currentTime)) == "00:00:00") {
      nextAudio()
    }

  }, 1000)
  

}

const openEculizer = () => {
  document.querySelector('.eculizer-content').style = 'left: 0;'
}

const closeEculizer = () => {
  document.querySelector('.eculizer-content').style = '-500p'
}

let FILSTYLE = 'black'
let SHADOW = 'deeppink'

var analyzer, canvas, ctx

const onload = (audio) => {
  canvas = document.getElementById('canvas')
  canvas.width = window.innerWidth
  canvas.height = 250
  ctx = canvas.getContext('2d')
  var audioContext = new AudioContext()
  analyzer = audioContext.createAnalyser()
  analyzer.fftSize = 2048
  var source = audioContext.createMediaElementSource(audio)
  source.connect(analyzer)
  analyzer.connect(audioContext.destination)

  draw()
}

function draw() {
  requestAnimationFrame(draw)
  var spectrum = new Uint8Array(analyzer.frequencyBinCount)
  analyzer.getByteFrequencyData(spectrum)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  var prev = {
    x: 0,
    y: 0
  }

  var w = 1

  ctx.beginPath()
  ctx.moveTo(0, canvas.height)
  ctx.lineTo(0, canvas.height - spectrum[0])

  for (var i = 0; i < spectrum.length; i += w) {

    var curr = {
      x: i,
      y: canvas.height - spectrum[i]
    }

    var next = {
      x: i + w,
      y: canvas.height - spectrum[i + w]
    }

    var xc = (curr.x + next.x) / 2;
    var yc = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, xc, yc)

    prev = {
      x: curr.x,
      y: curr.y
    }
  }

  ctx.quadraticCurveTo(prev.x, prev.y, canvas.width, canvas.height)
  ctx.fillStyle = FILSTYLE;
  ctx.closePath(); //draw to first point
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = 50;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = -5;
  ctx.fill();
}

const stopAudio = () => {

  clearInterval(interval)
 
  document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">	&#10148;</div>`

  audio.pause()
  
  boolPause = true

}

const nextAudio = () => {

  if (alertAudio()) {
    return
  }

  clearInterval(interval)

  audio.pause()
  audio.currentTime = 0

  rengeAudio = 0

  if (numberTrack < playLists.length) {
    numberTrack = numberTrack + 1
  }

  if (numberTrack == playLists.length) {
    numberTrack = 0
  }

  audio.duration = 0
  ren.max = 0
  
  boolPause = false

  audioPlay()

}

const backAudio = () => {

  if (alertAudio()) {
    return
  }

  clearInterval(interval)

  audio.pause()
  audio.currentTime = 0

  rengeAudio = 0

  if (numberTrack >= 0) {
    numberTrack = numberTrack - 1
  }

  if (numberTrack < 0) {
    numberTrack = playLists.length - 1
  }

  audio.duration = 0
  ren.max = 0
  
  boolPause = false

  audioPlay()

}

const toTime = (seconds) => {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

const getMax = (dur) => {
  result = parseInt(dur)
  return result

}

const openModal = () => {

  tach()

  if (alertAudio()) {
    return
  }

  document.querySelector('.modal').style = "display:flex;"

  document.querySelector('.mapList').innerHTML = playLists.map((x, index) => `

<div class="list" style="box-shadow: 0 5px 10px -5px ${getBoxColorList(numberTrack, index)};" onclick="plyaList(${index})">
    
   
    <div class="numberTextList" style="color:${getBoxColorList(numberTrack, index)};">${index + 1}</div>
    
  
  <div class="textListCenter">
      <div class="h ${getAnimationClass(numberTrack, index)}">${getMinText(x.name)}...</div>
      <p>Исполнитель</p>
  </div>

  <div class="timeListText" style="color:${getBoxColorList(numberTrack, index)};">
    ${getStateAudio(numberTrack, index)}
  </div>
  
</div>

  `).join("")
}


const closeModal = () => {
  document.querySelector('.modal').style = "display:none;"
}


const plyaList = (indx) => {
  
  rengeAudio = 0
  
  audio.currentTime = 0
  audioCurentTime = 0
  
  audio.duration = 0
  ren.max = 0
  
  boolPause == false
  
  numberTrack = indx
  stopAudio()
  
  
  
  audioPlay(indx)

  document.querySelector('.mapList').innerHTML = playLists.map((x, index) => `
  
  <div class="list" style="box-shadow: 0 5px 10px -5px ${getBoxColorList(numberTrack, index)};" onclick="plyaList(${index})">
      
     
      <div class="numberTextList" style="color:${getBoxColorList(numberTrack, index)};">${index + 1}</div>
      
    
    <div class="textListCenter">
        <div class="h ${getAnimationClass(numberTrack, index)}">${getMinText(x.name)}...</div>
        <p>Исполнитель</p>
    </div>
  
    <div class="timeListText" style="color:${getBoxColorList(numberTrack, index)};">
      ${getStateAudio(numberTrack, index)}
    </div>
    
  </div>
  
    `).join("")

}


const alertAudio = () => {
  if (playLists.length == 0) {
    document.querySelector('.alert').style = "display:block;"

    setTimeout(() => {
      document.querySelector('.alert').style = "display:none;"
    }, 3000)

    return true
  }
}


const getBoxColorList = (treckIndex, indexList) => {

  if (treckIndex == indexList) {
    return "red"
  }

  if (treckIndex !== indexList) {
    return
  }

}

const getStateAudio = (treckIndex, indexList) => {

  if (treckIndex == indexList) {
    return "играет"
  }

  if (treckIndex !== indexList) {
    return "musika"
  }
}

let getAnimationClass = (treckIndex, indexList) => {

  if (treckIndex == indexList) {
    return "animationText"
  }

  return
}


let getMinText = (text) => {
return  text.slice(0, 35)
}



