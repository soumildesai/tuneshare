<template>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details">

    <!-- playlist information -->
    <div class="playlist-info">
      <div class="cover">
        <img :src="playlist.coverUrl">
      </div>
      <h2>{{ playlist.title }}</h2>
      <p class="username">Created by {{ playlist.username }}</p>
      <p class="description">{{ playlist.description }}</p>
      <button @click="playPlaylist" class="playlistButton">Play</button>
      <button v-if="ownership" @click="handleDelete">
        Delete Playlist</button>
    </div>

    <!-- song list -->
    <div class="song-list">
      <div v-if="!playlist.songs.length">No songs have been added to this playlist yet</div>
      <div class="single-song" v-for="song in playlist.songs" :key="song.id" @click="playSong(song.id)">
        <div class="details">
          <h3>{{song.title}}</h3>
          <p>{{song.artist}}</p>
        </div>
        <button v-if="ownership" @click="handleClick(song.id)">Delete</button>
      </div>
      <AddSong v-if="ownership" :playlist="playlist"/>
    </div>
  </div>
</template>

<script>
import AddSong from '@/components/AddSong.vue'
import getDocument from '@/composables/getDocument'
import getUser from '@/composables/getUser'
import { computed, ref } from 'vue'
import useDocument from '@/composables/useDocument'
import useStorage from '@/composables/useStorage'
import { useRouter } from 'vue-router'
export default {
  props: ['id'],
  setup(props) {
    const { error, document: playlist } = getDocument('playlists', props.id)
    const { user } = getUser()
    const { deleteDoc, updateSongs } = useDocument('playlists', props.id)
    const { deleteImage } = useStorage()
    const router = useRouter()
    let audio = document.createElement('audio')
    const isPlaying = ref(audio.paused)
    const ownership = computed(() => {
      return playlist.value 
        && user.value 
        && user.value.uid == playlist.value.userId
    })
    const handleDelete = async () => {
      await deleteSongs()
      await deleteImage(playlist.value.filePath)
      await deleteDoc()
      router.push({ name: 'Home'})
    }
    const handleClick = async (id) => {
      const songs = playlist.value.songs.filter((song) => {
        song.id != id
      })
      playlist.value.songs.forEach((song) => {
        if(id === song.id){
          deleteImage(song.filePath)
        }
      }) 
      await updateSongs({songs})
    }
    const playSong = async (id) => {
      
      playlist.value.songs.forEach((song) => {
        if(id === song.id){
          if(audio.src != song.fileUrl){
            audio.src = song.fileUrl
          }
          try{
            if(audio.paused){
              audio.play();
              isPlaying.value = audio.paused
            } else{
              audio.pause();
              isPlaying.value = audio.paused
            }
          } catch(err){
            console.log(err.message)
          }
        }
      })
    }
    const deleteSongs = async () => {
      playlist.value.songs.forEach((song) => {
        deleteImage(song.filePath)
      })
    }
    const playPlaylist = async () => {
      var i = 0;
      // while(i < playlist.value.songs.length){
      //   if(audio.src == null || audio.ended){
      //     playSong(playlist.value.songs[i].id);
      //     i++;
      //   }
      // }

    
      // for(i = 0; i < playlist.value.songs.length; i++){
      //   console.log(i)
      //   if(audio.ended || !audio.src){
      //     playSong(playlist.value.songs[i].id)
      //     console.log(i)
      //   }
      // }

      // for(i = 0; i < playlist.value.songs.length;){
      //   if(audio.ended || !audio.src){
      //     console.log(audio.ended)
      //     playSong(playlist.value.songs[i].id)
      //     setTimeout(() => {
      //       i++
      //       playSong(playlist.value.songs[i].id)
      //     }, audio.duration);
      //     console.log(i)
      //   }
      // }
    }
    return { error, playlist, ownership, handleDelete, handleClick, playSong, deleteSongs, playPlaylist, isPlaying}
  },
  components: {AddSong}
}
</script>

<style>
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  }
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
  }
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .description {
    text-align: left;
  }
  .single-song{
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 10px;
    background: white;
    transition: all ease 0.2s;
  }
  .single-song:hover{
    box-shadow: 1px 2px 3px rgba(50,50,50,0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
    cursor: pointer;
  }
  .playlistButton{
    margin-right: 20px;
  }
</style>
