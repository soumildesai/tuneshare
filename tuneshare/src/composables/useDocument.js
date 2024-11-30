import {ref} from 'vue'
import {projectFirestore} from '../firebase/config'
const useDocument = (collection, id) => {
    const error = ref(null)
    const isPending = ref(false)
    let docRef = projectFirestore.collection(collection).doc(id)

    const deleteDoc = async () => {
        isPending.value = true
        error.value = null
        try{
            const res = await docRef.delete()
            isPending.value = false
            return res
        } catch (err){
            console.log(err.message)
            isPending.value = false
            error.value = 'could not delete the document'
        }
    }
    const updateSongs = async (newSongs) => {
        isPending.value = true
        error.value = null
        try{
            const res = await docRef.update(newSongs)
            isPending.value = false
            return res
        } catch(err){
            console.log(err.message)
            error.value = err.message
        }
    }
    return {error, isPending, deleteDoc, updateSongs}
}
export default useDocument