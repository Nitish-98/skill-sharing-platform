function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
let currentSong=new Audio();

async function getSongs() {
    const res = await fetch("http://127.0.0.1:5500/Songs/");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = [...doc.querySelectorAll("a")];
    const Songs = links
      .map(link => link.getAttribute("href")) 
      .filter(href => href.endsWith(".mp3")); 
      const cleanedSongs = Songs.map(song => song.replace('/Songs/', ''));
    return cleanedSongs; 
  }

  const playMusic = (track,pause = false) => {
    currentSong.src = "/Songs/" + track
   
 if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    
   }
        document.querySelector(".songinfo").innerHTML = decodeURI (track);
        document.querySelector(".time").innerHTML = "00:00 / 00:00" ;
       


}

  async function main() {
    
    let songs = await getSongs();
    
    
    console.log(songs);
    playMusic(songs[0], true);
    
   
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let li = document.createElement("li");
        let songName = song.replaceAll("/Songs/", "").replaceAll("%20", " ");
        
        li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${songName}</div>
                
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        `;
        
        songUl.appendChild(li);

    }
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

}

   main ();
   
    
  
  
  
  