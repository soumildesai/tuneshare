<template>
  <div class="add-song">
      <button v-if="!showForm" @click="showForm = true">Add Songs</button>
      <form v-else @submit.prevent="handleSubmit">
          <h4>Add a New Song</h4>
          <input type="text" placeholder="Song title" required v-model="title">
          <input type="text" placeholder="Artist" required v-model="artist">
          <label>Upload Song</label>
          <input type="file" @change="handleChange">
          <button>Add</button>
      </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import useDocument from '@/composables/useDocument'
import useStorage from '@/composables/useStorage'
import getUser from '@/composables/getUser'
export default {
    props: ['playlist'],
    setup(props){
        const title = ref('')
        const artist = ref('')
        const showForm = ref(false)
        const file = ref(null)
        const fileError = ref(null)
        const {updateSongs} = useDocument('playlists', props.playlist.id)
        const { filePath, url, uploadSong} = useStorage()
        const {user} = getUser();
        const handleSubmit = async () => {
            if(file.value){
                await uploadSong(file.value)
                const newSong = {
                    title: title.value,
                    artist: artist.value,
                    id: Math.floor(Math.random() * Date.now()),
                    userId: user.value.uid,
                    fileUrl: url.value,
                    filePath: filePath.value,
                }
                 await updateSongs({
                    songs: [...props.playlist.songs, newSong]
                })
                title.value = ''
                artist.value = ''
                file.value = null
            }
           
        }
        const types = ['audio/mpeg', 'audio/wav']
        const handleChange = (e) => {
            let selected = e.target.files[0]
            console.log(selected)
            if (selected && types.includes(selected.type)) {
                file.value = selected
                fileError.value = null
            } else {
                file.value = null
                fileError.value = 'Please select an audio file (mp3 or wav)'
            }
        }
        return {title, artist, showForm, handleSubmit, updateSongs, handleChange, filePath, url}
    }
}
</script>

<style scoped>
    .add-song{
        text-align: center;
        margin-top: 40px;
    }
    form{
        max-width: 100%;
        text-align: left;
    }
</style>