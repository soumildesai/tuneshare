<template>
  <div class="container">
    <div class="chat">
      <ChatWindow />
      <NewChatForm />
    </div>
    <img src="../assets/okbuddy.jpg" class="thumbnail"/>
  </div>
</template>

<script>
import NewChatForm from '../components/NewChatForm.vue'
import ChatWindow from '../components/ChatWindow.vue'
import getUser from '../composables/getUser'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
export default {
  components: {NewChatForm, ChatWindow },
  setup() {
    const router = useRouter()
    const { user } = getUser()
    // if the user value is ever null, redirect to welcome screen
    watch(user, () => {
      if (!user.value) {
        router.push({ name: 'Welcome' })
      }
    })
  }
}
</script>

<style>
  .thumbnail {
    max-width: 400px;
    max-height: 400px;
    overflow: hidden;
    border-radius: 10px;
  }
  img {
    max-width: 150%;
    max-height: 150%;
  }
  .container{
    display: flex;
    justify-content: space-between;
  }
  .chat{
    min-width: 35vw;
  }
  @media screen and (max-width: 792px){
    .container{
      display: block;
    }
    .chat{
      min-width: 90vw;
    }
  }
</style>