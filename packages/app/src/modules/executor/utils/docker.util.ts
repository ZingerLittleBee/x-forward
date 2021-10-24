import { $ } from 'zx'

export const dockerExec = async (containerName: string, cmd: string, arg: string[]) => {
    return $`docker exec ${containerName} ${cmd} ${arg}`
}