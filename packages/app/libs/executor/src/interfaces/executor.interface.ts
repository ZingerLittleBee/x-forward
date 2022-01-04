import { INginxConfig } from './nginx-config.interface'
import { INginxStatus } from './nginx-status.interface'
import { ISystem } from './system.interface'

export interface IExecutor extends INginxStatus, INginxConfig, ISystem {}
