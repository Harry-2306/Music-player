function nextcounter(length, current) {
    if (current == length - 1) {
        current = 0
    } else {
        current = current + 1
    }
    return current
}

function prevcounter(length, current) {
    if (current != 0) {
        current = current - 1
    }
    return current
}


let songprogressbar = document.getElementById("4")  //the seek bar
let volumebar = document.getElementById("3")    // the volume bar
let nextbutton = document.getElementById("2")  // the forward button
let song = document.createElement("audio")
document.body.append(song)

let songlist = ["new.mp3", "lol.mp3", "phone.mp3"]

let length = songlist.length
let current = 0




//the play button starts


let button = document.getElementById("1")    //the play/pause button


let toggleswitch = 0   //for the play/pause button

button.addEventListener("click", () => {

    if (toggleswitch == 0) {
        if (current == 0) {
            if (song.currentTime == 0) {
                song.src = songlist[current]
            }
        }
        button.innerHTML = "Pause"
        song.play()
        toggleswitch = 1

    } else {
        button.innerHTML = "Play"
        song.pause()
        toggleswitch = 0
    }


})


//the play button ends

var nextsong

//the forward button starts
nextbutton.addEventListener("click", () => {
    songprogressbar.value = 0
    current = nextcounter(length, current)
    nextsong = songlist[current]
    song.src = nextsong
    console.log(nextsong)
    console.log(length, current)
    song.play()

    console.log("song played")
    console.log("length of song", song.length)
    button.innerHTML = "Pause"
    toggleswitch = 1

})
//the forward button ends

//the previous button starts 


let prevbutton = document.getElementById("0")
/////////////////////////////////////////////////////
/////////////////////////////////

/////////////////////////////////
////////////////////////////////////////////////////


//autoplay the next song  if a song ends
setInterval(() => {

    if (song.ended == true) {
        song.pause()
        songprogressbar.value = 0
        current = nextcounter(length, current)
        nextsong = songlist[current]
        song.src = nextsong
        song.play()
        toggleswitch = 1

    }

}, 100)
//code for next song autoplay ends here

prevbutton.addEventListener("click", () => {
    songprogressbar.value = 0
    song.pause()
    song.currentTime = 0
    song.play()
    button.innerHTML = "Pause"
    toggleswitch = 1

})

prevbutton.addEventListener("dblclick", () => {
    songprogressbar.value = 0
    song.pause()
    current = prevcounter(length, current)
    nextsong = songlist[current]
    song.src = nextsong
    song.play()
    button.innerHTML = "Pause"
    toggleswitch = 1
})


//code for the volumebar starts here
let maxvalue = 100
volumebar.addEventListener("click", () => {
    let setvalue = volumebar.value
    song.volume = setvalue / maxvalue
})
//code for the volumebar ends here


let seekflag = 0


var incrementer = setInterval(() => {

    if (song.src == '') {
        songprogressbar.value = 0
    } else {
        if (song.ended) {
            songprogressbar.value = 0
        } else {
            songprogressbar.value = (song.currentTime / song.duration) * 100
        }
    }
    console.log("runnign")

}, 100)





songprogressbar.addEventListener("click", () => {
    clearInterval(incrementer)
    song.pause()
    let setvalue = songprogressbar.value
    song.currentTime = (setvalue / maxvalue) * (song.duration)
    song.play()
    incrementer = setInterval(() => {
        if (song.src == null) {
            songprogressbar.value = 0
        } else {
            if (song.ended) {
                songprogressbar.value = 0
            } else {
                songprogressbar.value = (song.currentTime / song.duration) * 100
            }
        }
        console.log("runnign")
    }, 100)
})

let images=fetch('http://127.0.0.1:5501/elementsimages/')