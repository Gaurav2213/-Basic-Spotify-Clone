console.log("lets start with javascript")
let currentSong = new Audio;
let currFolder;
let currentVolume=0

// Convert seconds to minute in format
function convertSecondsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}




/* Get Song function by uing fetch API) */
async function getSongs(folder) {
    currFolder = folder;
    // Here we are fetching list of songs from local host by appending address of local host
    let a = await fetch(`http://127.0.0.1:5500/Music-Player/${currFolder}/`);
    // here we are converting that into text
    let respone = await a.text();
    console.log(respone);
    // Here appending all that text data into div tag of html using js
    let div = document.createElement("div")
    div.innerHTML = respone;
    // getching all info/songs from anchor tag that is in html
    let as = div.getElementsByTagName("a")
    Songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let name = element.href.split(`/${currFolder}/`)[1];
            // Removing Mp3 at the end of names
            let withoutmp3 = name.split(".mp3")[0];
            Songs.push(name)
        }
    }

    let songUL = document.querySelector(".songLists").getElementsByTagName('ul')[0];
    songUL.innerHTML = ""
    for (const song of Songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="music.svg" class="invert" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Singer</div>

        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="play.svg" alt="">
        </div>
    </li>`;
    }

    // attach an event listner to each song
    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playsong(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })
    return Songs
}

const playsong = (track) => {
    currentSong.src = `/Music-Player/${currFolder}/` + track
    // let audio = new Audio("/Music-Player/Songs/"+track);
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songInfo").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}

async function main() {
    let Songs = await getSongs("Songs")
    console.log(Songs)

    // code to show all songs name under playlist


    // Attach an event listner to play next and previous button

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // timeupdate html

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // add event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    // add event listner to hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add event listner to previous
    previous.addEventListener("click", () => {
        let index = Songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if (index - 1 >= 0) {
            playsong(Songs[index - 1])
        }
    })


    // add event listner to next
    next.addEventListener("click", () => {
        let index = Songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if (index + 1 > length) {
            playsong(Songs[index + 1])
        }
        else{
            playsong(Songs[0])

        }

    })

    //add an event listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        e => {
            currentSong.volume = parseInt(e.target.value) / 100
        })

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
           Songs =  await getSongs(`${item.currentTarget.dataset.folder}`)
        })
    })

    //add an event listner to mute
    document.querySelector(".Volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentVolume = currentSong.volume
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            console.log("In else Part")

            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = currentVolume
            document.querySelector(".range").getElementsByTagName("input")[0].value = currentVolume*100
        }
    })

}

main()