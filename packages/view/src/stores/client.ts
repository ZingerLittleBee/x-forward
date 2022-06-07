import { getAllClient } from '@/request'
import { get, set } from '@/utils/storage.utils'
import { ClientVo } from '@x-forward/app/apps/x-forward-server/src/modules/client/vo/client.vo'
import { defineStore } from 'pinia'

const currentClentIdKey = 'CLIENT/CURRENT_CLIENT_ID'

type ClientStore = {
    clients?: ClientVo[]
    currentClentId?: string
}

export const useClientStore = defineStore('client', {
    state: () => ({ clients: [] } as ClientStore),
    getters: {
        getCurrentClientId: state => {
            if (state.currentClentId) {
                return state.currentClentId
            }
            if (get(currentClentIdKey)) {
                return get(currentClentIdKey)
            }
            return state.clients?.[0]?.id
        }
    },
    actions: {
        changeCurrentClient(newClientId: string) {
            set(currentClentIdKey, newClientId)
            this.currentClentId = newClientId
        },
        async initClient() {
            try {
                const { data: clients } = await getAllClient()
                this.clients = clients ? clients.value : []
            } catch (e) {
                console.error(`获取客户端列表失败：${e}`)
            }
        }
    }
})
