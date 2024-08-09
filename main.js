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
  box-shadow: ${getRandomArbitrary(-40, 40)}px 0 25px 1px rgb(139, 0, 0);
  transform: rotate(${getRandomArbitrary(-360, 360)}deg);
  `
  document.querySelector('.app2').style = `
    box-shadow: 15px ${getRandomArbitrary(-20, 20)}px 25px 1px rgb(255, 20, 147);
    transform: rotate(${getRandomArbitrary(-360, 360)}deg);
    `
}, 3000)


let playLists = ["/Pirates of the Caribbean - He's a Pirate (Piano Version).mp3"]

const showFile = (input) => {

  let files = input.files

  for (var i = 0; i < files.length; i++) {
    playLists.push(URL.createObjectURL(files[i]))
  }

}

document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">&#10148;</div>`



let audio = new Audio()
let numberTrack = 0

let rengeAudio = 0
let ren = document.querySelector('.range')
ren.value = 0
ren.min = 0


let interval

const audioPlay = () => {

  if (alertAudio()) {
    return
  }

  ren.min = 0

  audio.duration = 0


  audio.src = playLists[numberTrack]



  document.querySelector('.PlayPause').innerHTML = ` <div style="transform: rotate(90deg);" onclick="stopAudio()">	&#61;</div>`


  audio.play()


  interval = setInterval(() => {



    rengeAudio = rengeAudio + 1

    ren.value = rengeAudio

    ren.max = getMax(audio.duration)

    console.log(rengeAudio, " ", ren.value, " ", ren.max, " ", ren.min)

    document.querySelector('.time').innerHTML = toTime(parseInt(audio.duration) - parseInt(audio.currentTime))


    if (toTime(parseInt(audio.duration) - parseInt(audio.currentTime)) == "00:00:00") {
      nextAudio()
    }

  }, 1000)

}



const stopAudio = () => {

  clearInterval(interval)

  rengeAudio = 0

  audio.duration = 0
  ren.max = 0

  document.querySelector('.PlayPause').innerHTML = ` <div onclick="audioPlay()">	&#10148;</div>`

  audio.pause()

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

  if (alertAudio()) {
    return
  }



  document.querySelector('.modal').style = "display:flex;"



  document.querySelector('.mapList').innerHTML = playLists.map((x, index) => `

<div class="list" style="box-shadow: 0 5px 10px -5px ${getBoxColorList(numberTrack, index)};" onclick="plyaList(${index})">
    
   
    <div class="numberTextList" style="color:${getBoxColorList(numberTrack, index)};">${index + 1}</div>
    
  
  <div class="textListCenter">
      <div class="h">${x}</div>
      <p>Исполнитель</p>
  </div>

  <div class="timeListText">
    23:00
  </div>
  
</div>

  `).join("")
}


const closeModal = () => {
  document.querySelector('.modal').style = "display:none;"
}


const plyaList = (indx) => {

  numberTrack = indx
  stopAudio()
  audioPlay(indx)
  closeModal()
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