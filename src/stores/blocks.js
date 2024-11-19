import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useBlocksStore = defineStore("block", {
    state: () => ({
        blocks: [],
    }),
    getters: {
        getBlocks(state) {
            return state.blocks.data
        }
    },
    actions: {
        async fetchBlocks() {
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/blocks?filters[entity][id][$in][]=3')
                this.blocks = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})