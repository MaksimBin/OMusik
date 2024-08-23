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
  getAppList('popular', 'новинки') //сделать при открытии
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
}, 3000)


let arrMapLists = [[], [], [], []]
let playLists = []
let phonePlaylist = []

let collectionTextState
let collectionTextText


const showFile = (input) => {

  //playLists = [] чистка листа

  let files = input.files

  for (var i = 0; i < files.length; i++) {

    phonePlaylist.push(
    {
      "soundid": i,
      "serverPostId": "",
      "musicUrl": URL.createObjectURL(files[i]),
      "title": files[i].name,
      "artistName": "с телефона",
      "musicUrlInResources": "",
      "coverURL": true
    })
  }
}
///////////////////////тут исправить
document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">&#10148;</div>`

let audio = document.getElementById('audioMp3')

//audio = new Audio()



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
let colorEculizerInterval

let SECONDS

audio.crossOrigin = "anonymous | use-credentials"

const audioPlay = () => {
  

  //console.log(numberTrack)

  document.querySelector('.PlayPause').innerHTML = ` <div style="transform: rotate(90deg);" onclick="stopAudio()">	&#61;</div>`
  
  audio = new Audio(playLists[numberTrack].musicUrl)
  
  
  
  if (!boolPause) {
    ren.min = 0
    audio.duration = 0
  }

  if (boolPause) {
    audio.currentTime = audioCurentTime
  }

  let bollNexstTime = true
  

    audio.addEventListener("canplaythrough", () => {
      
      audio.play()
    
    
      bollNexstTime = false
      //console.log("поток интервал", audio//.currentTime)
    
    })
  
 onload(audio)
  getColorEculizerSound()
  
  
  
 interval = setInterval(() => {
    
  //  console.log("поток интервал", audio//.currentTime)
     
    if (toTime(parseInt(audio.duration) - parseInt(audio.currentTime)) < SECONDS) {
    rengeAudio = rengeAudio + 1
    ren.value = rengeAudio
    ren.max = getMax(audio.duration)
    audioCurentTime = audio.currentTime
       }

     SECONDS = toTime(parseInt(audio.duration) - parseInt(audio.currentTime))

    document.querySelector('.time').innerHTML = toTime(parseInt(audio.duration) - parseInt(audio.currentTime))


    if (toTime(parseInt(audio.duration) - parseInt(audio.currentTime)) == "00:00:00" && bollNexstTime !== true) {
      nextAudio()
    }
   

 }, 1000) 

}



const openEculizer = () => {

  document.querySelector('.eculizer-content').style = 'left: 0;'
}

const closeEculizer = () => {
  document.querySelector('.eculizer-content').style = 'left: -500px'
}

let FILSTYLE = 'black'
let SHADOW = 'deeppink'

var analyzer, canvas, ctx

function onload(audio) {
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
  requestAnimationFrame(draw) //draw
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
  ctx.closePath();
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = 50;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = -5;
  ctx.fill();
}


let getColorEculizerSound = () => {
  colorEculizerInterval = setInterval(() => {
    setTimeout(() => {SHADOW = "grey"},15000)
    setTimeout(() => {SHADOW = "deeppink"},30000)
    
  }, 45000)
  
}

const stopAudio = () => {

  clearInterval(interval)
  clearInterval(colorEculizerInterval)

  document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">	&#10148;</div>`

  audio.pause()
  boolPause = true
}

const nextAudio = () => {

  clearInterval(interval)
  clearInterval(colorEculizerInterval)

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

  getDisplayList(textCurl) /////// изменение цвета

}

const backAudio = () => {

  clearInterval(interval)
  clearInterval(colorEculizerInterval)

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

  getDisplayList(textCurl) /////// изменение цвета

}

const toTime = (seconds) => {

  if (!seconds) {
   // console.log(seconds)
    return "00:00:00"
  }



  var date = new Date(null);
  date.setSeconds(seconds);



  if (date.toISOString().substr(11, 8) == undefined) {
    return "00:00:00"
  } else {
    return date.toISOString().substr(11, 8);
  }


}

const getMax = (dur) => {
  result = parseInt(dur)
  return result

}

const openModal = () => {

  tach()

  document.querySelector('.modal').style = "display:flex;"

  document.querySelector('.mapList').innerHTML = playLists.map((x, index) => `

<div onclick="plyaList(${index})" class="list" style="box-shadow: 0 5px 10px -5px ${getBoxColorList(numberTrack, index)};">
    
   
    <div class="numberTextList" style="color:${getBoxColorList(numberTrack, index)};">${index + 1}</div>
    
  
  <div class="textListCenter">
      <div class="h ${getAnimationClass(numberTrack, index)}">${getMinText(x.title)}...</div>
      <p>${x.artistName}</p>
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


const closeOpenPlaylist = () => {
  closeCollrctions()
  openModal()
}

let textCurl

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

  getDisplayList(textCurl) /////// изменение цвета

  document.querySelector('.mapList').innerHTML = playLists.map((x, index) => `
  
  <div class="list" style="box-shadow: 0 5px 10px -5px ${getBoxColorList(numberTrack, index)};" onclick="plyaList(${index})">
      
     
      <div class="numberTextList" style="color:${getBoxColorList(numberTrack, index)};">${index + 1}</div>
      
    
    <div class="textListCenter">
        <div class="h ${getAnimationClass(numberTrack, index)}">${getMinText(x.title)}...</div>
        <p>${x.artistName}</p>
    </div>
  
    <div class="timeListText" style="color:${getBoxColorList(numberTrack, index)};">
      ${getStateAudio(numberTrack, index)}
    </div>
    
  </div>
    `).join("")
}


const alertAudio = () => {
  if (phonePlaylist.length == 0) {
    document.querySelector('.alert').style = "display:block;"

    setTimeout(() => {
      document.querySelector('.alert').style = "display:none;"
    }, 3000)

    return true
  }
}


let getMinText = (text) => {
  return text.slice(0, 35)
}

const openCollrctions = () => {

  document.querySelector('.moduleSTracks').style = "display:flex;"

  //if (collectionTextState !== //collectionTextText) {
  //  getAppList(collectionTextState, //collectionTextText) //сделать при //открытии
  // } else {
  //    getAppList('popular', 'новинки') //сделать при открытии
  //  }
}


const closeCollrctions = () => {
  document.querySelector('.moduleSTracks').style = "display:none;"
}


/////////GET MUSICS
async function getFetchJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`
    throw new Error(message)
  }

  let json = await response.json()
  return json
}

const getMusicsApi = async (url, text) => {
  getLoading(true)
  getFetchJSON(url)
    .then(json => newMapArrs(json))
    .then(json => {
      getDisplayList(text)
      getLoading(false)
    })
    .catch(error => {
      error.message
      document.querySelector('.publick').innerHTML = `
        ${text}
        `
      getLoading(false)

      document.querySelector('.contentColumnState').innerHTML = `
      <div>неполадки с интернетом...
             </div>`

    })
}

const getAppList = (params, text) => {

  //numberTrack = 0 //сохроняет дорожку листов

  collectionTextState = params
  collectionTextText = text

  if (params !== 'tel') {
    getMusicsApi(
      `http://147.45.245.154:8080/api/v1/music/genre/${params}`,
      text
    )
  }

  if (phonePlaylist.length !== 0 && params == 'tel') {
    playLists = [...phonePlaylist]
    newMapArrs(phonePlaylist)
    getDisplayList(text)
  }

  if (phonePlaylist.length == 0 && params == 'tel') {
    alertAudio()
  }

}

const getDisplayList = (text) => {

  textCurl = text

  document.querySelector('.publick').innerHTML = `
  ${text}
  `

  document.querySelector('.overflouTracks').innerHTML = arrMapLists.map((list, index) => `
  
       <div id="${index}" class="overflouColumn">
       
       ${arrMapLists[index].map((x, ind) => `
       
         <div class="elementOverflou" onclick="plyaList(${x.soundid})">

            <div class="numberTextList" style="color:deeppink;color:${getBoxColorList(numberTrack, x.soundid)};! imported">${x.soundid + 1}</div>

            <div class="textListCenter">
              <div class="h">${getMinText(x.title)}</div>
              <p>${x.artistName}</p>
            </div>

            <div class="timeListText" style="color:grey;color:${getBoxColorList(numberTrack, x.soundid)};! imported">
              ${getStateAudio(numberTrack, x.soundid)}
            </div>

          </div>

       `).join("")}
       </div>
  `).join("")
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


let getLoading = (stateLoading) => {
  if (stateLoading) {
    document.querySelector('.loading').style = "display:;"
  }
  if (!stateLoading) {
    document.querySelector('.loading').style = "display:none;"
  }
}


let newMapArrs = (resJson) => {

  playLists = [...resJson]

  resJson.map((resJ, index) => {
    resJ.soundid = index
    // sound id с маленькой буквы
  })

  arrMapLists[[0]] = resJson.slice(0, 4)
  arrMapLists[[1]] = resJson.slice(4, 8)
  arrMapLists[[2]] = resJson.slice(8, 12)
  arrMapLists[[3]] = resJson.slice(12, 16)

}
///////////GET MUSICS


/////////////////staticUrl
//// сейчас не работает
let getStaticServerUrl = (playL) => {

  if (playL.coverURL) {
    return playL.musicUrl
  } else {
    return `${playL.musicUrl.slice(0, 27)+playL.musicUrlInResources.slice(7)}`
  }
}
///////сейчас не работает
/////////////////staticUrl

