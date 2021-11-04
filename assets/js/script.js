const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var playlist = $('.playlist');
var audio = $('.audio');
var trackImg = $('.track-img');
var songName = $('.player .title .song-name')
var replay = $('.replay')
var previous = $('.previous');
var play_pause = $('.play-pause');
var play = $('.icon-play');
var pause = $('.icon-pause');
var next = $('.next');
var suffle = $('.suffle');
var progress = $('.progress');
var song;
var volume = $('.volume');
var volumeUp = $('.icon-volume');
var mute = $('.icon-mute');
const musicPlayer = {
    isPlaying: false,
    isLoop: false,
    isSuffle: false,
    currentIndex: 0,

    songs: [
        {
            name: 'Chúng ta của hiện tại',
            author: 'Sơn Tùng M-TP',
            path: './assets/song/Chúng Ta Của Hiện Tại.mp3',
            img: './assets/img/Chung ta cua hien tai.jpg'
        },
    
        {
            name: 'The playah',
            author: 'Soobin',
            path: './assets/song/The Playah.mp3',
            img: './assets/img/The playah.jpg'
        },

        {
            name: 'Đưa nhau đi trốn',
            author: 'Đen ft Linh Cáo',
            path: './assets/song/Đưa Nhau Đi Trốn.mp3',
            img: './assets/img/Dua nhau di tron.jpg'
        },

        {
            name: 'OK',
            author: 'Binz',
            path: './assets/song/OK.mp3',
            img: './assets/img/OK.jpg'
        },

        {
            name: 'Internet Love',
            author: 'hnhngan',
            path: './assets/song/Internet Love.mp3',
            img: './assets/img/Internet Love.jpg'
        },
    ],
    
    render: function()
    {
        const list = this.songs.map((song, index) => 
        {
            return `
            <div class="song" data-index = ${index}>

                <div class="song-img" style="background-image: url('${song.img}')">
                </div>
                
                <div class="song-info">

                    <div class="title">
                        ${song.name}
                    </div>

                    <div class="author">
                        ${song.author}
                    </div>

                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>

            </div>`
        })

        playlist.innerHTML = list.join('')
    },

    handleEvents: function()
    {
        const _this = this;
        const defaultWidth = trackImg.offsetWidth;

        const animation = trackImg.animate
        ([
            {
                transform: 'rotate(360deg)'
            }],

            {
                duration: 10000,
                iterations: Infinity
            }
        );

        animation.pause();

        document.onscroll = function() {
            newWidth =  defaultWidth - window.scrollY/2;   
            trackImg.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            trackImg.style.height = newWidth > 0 ? newWidth + 'px' : 0;
        }

        audio.onplay = function()
        {
            audio.play();
            animation.play();
            _this.isPlaying = true;
            pause.classList.remove('active');
            play.classList.add('active');
        }
        
        audio.onpause = function() 
        {
            animation.pause();
            pause.classList.add('active');
            play.classList.remove('active');
            _this.isPlaying = false;
        }

        audio.onended = function()
        {
            if(_this.isLoop)
            {
                audio.play();
                return;
            }
            if(_this.isSuffle)
            {
                do
                {
                 newIndex = Math.floor(Math.random() * _this.songs.length);
                } while (_this.currentIndex == newIndex);
                _this.currentIndex = newIndex;
                _this.loadSong();
            }
            next.click();
        }

        play_pause.onclick = function () 
        {

            if (_this.isPlaying == true)
            {
                audio.pause();
            }
            else
            {
                audio.play();
            }
        }

        audio.ontimeupdate = function() 
        {
            if (audio.duration)
            {
                progress.value = (audio.currentTime / audio.duration) * 100;
            }
        }

        volume.onchange = function(e) 
        {
            audio.volume = e.target.value/100;
            if(audio.volume == 0)
            {
                volumeUp.classList.add('hidden');
                mute.classList.remove('hidden');
            }
            else
            {
                volumeUp.classList.remove('hidden');
                mute.classList.add('hidden');
            }
        }

        progress.onchange = function(time) 
        {
            audio.currentTime = (time.target.value * audio.duration)/100;
        }

        previous.onmousedown = function()
        {
            previous.classList.add('active');
        }

        previous.onclick = function()
        {
            _this.currentIndex > 0 ? _this.currentIndex-- : _this.currentIndex = _this.songs.length -1;
            _this.loadSong();
            audio.play();
            previous.classList.remove('active');
        }

        next.onmousedown = function()
        {
            next.classList.add('active');
        }

        next.onclick = function()
        {
            _this.currentIndex < (_this.songs.length - 1) ? _this.currentIndex++ : _this.currentIndex = 0;
            _this.loadSong();
            audio.play();
            next.classList.remove('active');
        }

        suffle.onclick = function()
        {
            suffle.classList.toggle('active');
            _this.isSuffle = !_this.isSuffle;
        }

        replay.onclick = function()
        {
            replay.classList.toggle('active');
            _this.isLoop = !_this.isLoop;
        }

        playlist.onclick = function(e)
        {
            if (e.target.closest('.option'))
            {
                
            }
            else
            {
                const songNode = e.target.closest('.song:not(.active)')
                if(songNode)
                {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadSong();
                    audio.play();
                }
            }
        }
    },

    defineProperties: function() 
    {
        Object.defineProperty(this, 'currentSong', {
            get: function()
            {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadSong: function()
    {
        songName.textContent = this.currentSong.name;
        trackImg.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        song = $$('.song');
        audio.onloadedmetadata = function()
        {
            const time = Math.round(audio.duration);
            const min = Math.trunc(time/60);
            const sec = time - (min*60);
            $('.duration').innerHTML = `<p>${min}:${sec}</p>`
        }
        let activeElement = $('.song.active');
        activeElement != null ? activeElement.classList.remove('active') : null;
        song[this.currentIndex].classList.add('active');
        this.scrollToActiveSong();
    },

    scrollToActiveSong: function()
    {
        setTimeout(
                    $('.song.active').scrollIntoView
                    (   
                        {
                            behavior: 'smooth',
                            block: 'end',
                        }
                    ), 3000);

    },

    start: function() 
    {
        
        this.render()
        this.defineProperties()
        this.loadSong()
        this.handleEvents()
    }

}

musicPlayer.start();
