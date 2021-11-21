// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /env */
export async function EnvControllerTest(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/env', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /env/nginx/config */
export async function EnvControllerGetNginxConfig(options?: { [key: string]: any }) {
  return request<{ success?: boolean; message?: string; data?: API.NginxConfigVo }>(
    '/env/nginx/config',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 GET /env/nginx */
export async function EnvControllerGetOverview(options?: { [key: string]: any }) {
  return request<{ success?: boolean; message?: string; data?: API.OverviewVo }>('/env/nginx', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /env/os */
export async function EnvControllerGetSystemInfo(options?: { [key: string]: any }) {
  return request<{ success?: boolean; message?: string; data?: API.SystemInfoVo }>('/env/os', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /env/path */
export async function EnvControllerGetDirectory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.EnvControllerGetDirectoryParams & {
    // query
    url: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean; data?: string[] }>('/env/path', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
