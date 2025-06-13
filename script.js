let sourcelink = "http://127.0.0.1:5500/spotify%20clone/music/"       //the main link
let play="http://127.0.0.1:5500/spotify%20clone/elementsimages/play.svg"
let pauses="http://127.0.0.1:5500/spotify%20clone/elementsimages/pause.svg"
let tunes="http://127.0.0.1:5500/spotify%20clone/elementsimages/tunes.svg"
let playtune="http://127.0.0.1:5500/spotify%20clone/elementsimages/playtune.svg"



function nextsong(number, biggernumber) {
    var extra = number
    extra = extra + 1
    if (extra > biggernumber - 1) {
        extra = 0
    }
    console.log(extra)
    return extra
}



function previoussong(number) {
    if (number == 0) {
        return 0
    } else {
        return number - 1
    }
}







//deletes all the songs from the your library section
function deletequeue(list) {
    if (list.length != 0) {
        for (var iterator = 0; iterator < list.length; iterator++) {
            list[iterator].remove()
        }
    }
}


//enqueues all the songs to the your library section
function enqueue(listofsongs,tunes,playtune) {
    for (var song in listofsongs) {
        let songblock = document.createElement("div")
        songblock.classList.add("song")
        //adding the playtune image
        //http://127.0.0.1:5501/elementsimages/playtune.svg
        let icon = document.createElement("img")
        icon.src = tunes    //link
        icon.classList.add("tuneimage")
        //creating the sub container
        let subcont = document.createElement("div")
        subcont.classList.add("container")
        //adding the song title
        let title = document.createElement("div")
        title.innerHTML = song
        title.classList.add("songtitle")
        subcont.append(title)
        //adding the play now symbol
        let playbutton = document.createElement("button")
        playbutton.classList.add("playnow")

        let text = document.createElement("span")
        text.classList.add("randombs")
        text.innerHTML = "Play Now"
        playbutton.append(text)
        let playicon = document.createElement("img")
        playicon.classList.add("playimg")
        playicon.src = playtune   //link 2
        playbutton.append(playicon)
        //adding everything to the songblock
        songblock.append(icon)
        songblock.append(subcont)
        songblock.append(playbutton)
        document.querySelector(".playlist").append(songblock)

    }
}

/*this is kinda cool not gonna lie*/

function length(object) {
    let count = 0
    for (let keys in object) {
        count = count + 1
    }
    return count
}

//fetching and adding music to the library
async function process(link) {
    let answer = []
    songdict = {}
    let data = await fetch(link)
    let processed = await data.text()
    let newdiv = document.createElement("div")
    newdiv.innerHTML = processed
    let songdata = newdiv.getElementsByTagName("a")

    for (var i = 0; i < songdata.length; i++) {
        if (songdata[i].href.endsWith(".mp3")) {
            songdict[songdata[i].title] = songdata[i].href       //the list of songs
        } else if (songdata[i].href.endsWith(".json")) {
            answer[0] = songdata[i].href    //the json file
        } else if (songdata[i].href.endsWith(".jpg") || songdata[i].href.endsWith(".jpeg") || songdata[i].href.endsWith(".png")) {
            answer[2] = songdata[i].href   // the thumbnail for the playlist
        }
    }
    answer[1] = songdict

    let final = new Promise((resolve, reject) => {
        resolve(answer)
    })
    return final
}



async function playlist(sourcelink) {
    let data = await fetch(sourcelink)
    let intercept = await data.text()               //data intercepted from the fetch api

    let divwrapper = document.createElement("div")
    divwrapper.innerHTML = intercept
    let songelements = divwrapper.getElementsByTagName("a")


    let playlists = {}   //stores all the playlists

    for (var i = 0; i < songelements.length; i++) {
        if (isNaN(Number(songelements[i].title)) || Number(songelements[i].title) == 0) {
            continue
        }
        playlists[songelements[i].title] = songelements[i].href
    }


    for (let playlist in playlists) {
        let counterpart = await process(playlists[playlist])
        playlists[playlist] = counterpart
    }
    console.log(playlists)

    let final = new Promise((resolve, reject) => {
        resolve(playlists)
    })
    return final

}



//creating and adding the cards to the library

async function addplaylist() {
    let masterlist = await playlist(sourcelink)

    if (length(masterlist) == 0) {
        let container = document.querySelector(".right")
        let newdiv = document.createElement("div")
        let subdiv = document.createElement("div")
        newdiv.classList.add("elseplayframe")
        subdiv.classList.add("message")
        subdiv.innerHTML = "It looks like you don't have any saved playlists."
        newdiv.append(subdiv)
        container.prepend(newdiv)
    } else {
        let container = document.querySelector(".right")
        let box = document.createElement("div")

        box.classList.add("playframe")
        container.prepend(box)
        //{playlist_id:[.json,[listofsongs],.img],......}
        for (let element in masterlist) {
            //creating the card
            let card = document.createElement("div")
            card.classList.add("songbox")
            card.id = element
            //creating the thumbnail
            let thumbnail = document.createElement("img")
            thumbnail.src = masterlist[element][2]
            thumbnail.classList.add("thumbnail")
            //creating the title and the description
            let textdata = await fetch(masterlist[element][0])
            let intermdata = await textdata.text()
            let transdata = JSON.parse(intermdata)
            let playlist_name = transdata["name"]
            let playlist_desc = transdata["description"]
            let title = document.createElement("button")
            let description = document.createElement("button")
            title.innerHTML = playlist_name
            description.innerHTML = playlist_desc
            title.classList.add("title")
            description.classList.add("artist")
            //adding everything to the card
            card.append(thumbnail)
            card.append(title)
            card.append(description)
            box.append(card)
        }

        console.log("added all the playlists")
    }
    let final = new Promise((resolve, reject) => {
        resolve(masterlist)
    })
    console.log(masterlist)

    return final
}





async function main(play,pauses) {
    let masterlist = await addplaylist()


    var selectedplaylist = {}
    var songnames = []
    var songurl = []
    var songcounter = 0 //pointer which decideds which song goes next

    let listofbuttons = document.querySelectorAll(".buttons")
    var rewindbutton = listofbuttons[0]
    var playbutton = listofbuttons[1]
    var forwardbutton = listofbuttons[2]
    var toggleswitch = 0                           //0->button is currently playing and 1-> button is currently paused
    var audio = document.getElementsByTagName("audio")[0]
    audio.volume = 0.5

    var seekbar = document.querySelector(".seekbar")
    var volumebar = document.querySelector(".seekbar2")

    console.log(masterlist)
    let playlists = document.querySelectorAll(".songbox")

    for (var index = 0; index < playlists.length; index++) {
        let element = playlists[index]
        element.addEventListener("click", () => {
            audio.pause()
            document.getElementById("play").src = play
            toggleswitch = 0
            seekbar.value = 0
            if (document.querySelector(".status") != null) {
                document.querySelector(".status").remove()
                let container = document.createElement("div")
                container.classList.add("playlist")
                document.querySelector(".libtitle").insertAdjacentHTML("afterend", `<div class="playlist"></div>`)
            }
            deletequeue(document.querySelectorAll(".song"))
            document.querySelector(".videoplay").style.opacity = "1"
            var songlist = masterlist[element.id][1]
            selectedplaylist = songlist
            songnames = Object.keys(selectedplaylist)
            songurl = Object.values(selectedplaylist)
            songcounter = 0
            console.log(songnames, songurl)
            enqueue(songlist,tunes,playtune)


            audio.src = songurl[songcounter]
            document.querySelector(".currsong").innerHTML = songnames[songcounter]


            setInterval(() => {
                if (audio.src == '') {
                    seekbar.value = 0
                } else if (audio.ended == true) {
                    seekbar.value = 0
                    document.getElementById("play").src = play
                    audio.pause()
                    toggleswitch = 0
                    songcounter = nextsong(songcounter, songnames.length)
                    audio.src = songurl[songcounter]
                    document.querySelector(".currsong").innerHTML = songnames[songcounter]
                    document.getElementById("play").src = pauses
                    audio.play()
                    toggleswitch = 1
                } else {
                    seekbar.value = (audio.currentTime / audio.duration) * 100
                    console.log(seekbar.value)
                }
            }, 100)


            var samplelist = document.querySelectorAll(".song")

            for (var newindex = 0; newindex < samplelist.length; newindex++) {
                var song = samplelist[newindex]
                let storedindex = newindex
                song.addEventListener("click", () => {
                    //play audio code
                    //check if the song is already playiing
                    if (songcounter != storedindex) {
                        seekbar.value = 0
                        songcounter = storedindex
                        console.log("songcounter:", songcounter)
                        if (audio.paused == true) {
                            toggleswitch = 0
                            document.querySelector(".currsong").innerHTML = songnames[songcounter]
                            audio.src = songurl[songcounter]
                            document.getElementById("play").src = pauses
                            audio.play()
                            toggleswitch = 1
                        } else {
                            audio.pause()
                            document.getElementById("play").src = play
                            toggleswitch = 1
                            document.querySelector(".currsong").innerHTML = songnames[songcounter]
                            audio.src = songurl[songcounter]
                            audio.play()
                            document.getElementById("play").src = pauses
                            toggleswitch = 0
                        }
                    }



                })
            }
            //audio play code



        })
    }


    playbutton.addEventListener("click", () => {
        if (toggleswitch == 0) {
            document.getElementById("play").src = pauses
            audio.play()
            toggleswitch = 1

        } else {
            document.getElementById("play").src = play
            audio.pause()
            toggleswitch = 0
        }
    })

    volumebar.addEventListener("click", () => {
        audio.volume = (volumebar.value) / 100
    })
    forwardbutton.addEventListener("click", () => {
        audio.pause()
        toggleswitch = 0
        seekbar.value = 0
        document.getElementById("play").src = play
        songcounter = nextsong(songcounter, songnames.length)
        document.querySelector(".currsong").innerHTML = songnames[songcounter]
        audio.src = songurl[songcounter]
        audio.play()
        document.getElementById("play").src = pauses
        toggleswitch = 1
    })

    rewindbutton.addEventListener("click", () => {
        seekbar.value = 0
        document.getElementById("play").src = play
        audio.pause()
        toggleswitch = 0
        audio.currentTime = 0
        document.getElementById("play").src = pauses
        audio.play()
        toggleswitch = 1

    })
    rewindbutton.addEventListener("dblclick", () => {
        document.getElementById("play").src = play
        audio.pause()
        toggleswitch = 0
        songcounter = previoussong(songcounter)
        audio.src = songurl[songcounter]
        document.querySelector(".currsong").innerHTML = songnames[songcounter]
        document.getElementById("play").src = pauses
        audio.play()
        toggleswitch = 1
    })

    seekbar.addEventListener("click", () => {
        document.getElementById("play").src = play
        audio.pause()
        toggleswitch = 0
        audio.currentTime = (seekbar.value / 100) * audio.duration
        document.getElementById("play").src = pauses
        audio.play()
        toggleswitch = 1




    })






}
main(play,pauses)




// function pause()
// function play()



