import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useBlocksStore = defineStore("block", {
    state: () => ({
        blocks: [],
        isLoading: false,
        blocksError: null,
    }),
    getters: {
        getBlocks(state) {
            return state.blocks.data
        }
    },
    actions: {
        async fetchBlocks() {
            // Set isLoading to true to show a loading spinner
            this.isLoading = true
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/blocks?filters[entity][id][$in][]=4')
                this.blocks = data.data
            } catch (error) {
                // alert(error)
                this.blocksError = error
                console.log(error)
            } finally {
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false
            }
        }
    },
})