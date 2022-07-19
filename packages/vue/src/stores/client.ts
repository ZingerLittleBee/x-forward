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
    state: () => ({ clients: [], currentClentId: '' } as ClientStore),
    getters: {
        getCurrentClientId: state => state.currentClentId
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
                const defaultIdInStorage = get(currentClentIdKey)
                if (defaultIdInStorage && this.clients?.some(client => client.id === defaultIdInStorage)) {
                    this.currentClentId = defaultIdInStorage
                } else {
                    this.currentClentId = this.clients?.[0]?.id
                }
            } catch (e) {
                console.error(`获取客户端列表失败：${e}`)
            }
        }
    }
})
