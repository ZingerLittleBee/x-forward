// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /stream */
export async function StreamControllerGetAllStream(options?: { [key: string]: any }) {
  return request<{ success?: boolean; data?: API.StreamVo[] }>('/stream', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /stream */
export async function StreamControllerCreateOne(
  body: API.CreateStreamDto,
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean; message?: string; data?: API.StreamVo }>('/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /stream */
export async function StreamControllerDeleteAllStream(options?: { [key: string]: any }) {
  return request<{ success?: boolean; message?: string; data?: number }>('/stream', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /stream */
export async function StreamControllerUpdateAllStream(
  body: string[],
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean; message?: string }>('/stream', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /stream/${param0}/state */
export async function StreamControllerUpdateStateById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.StreamControllerUpdateStateByIdParams & {
    // path
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(`/stream/${param0}/state`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /stream/${param0}/name */
export async function StreamControllerUpdateUpstreamIdById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.StreamControllerUpdateUpstreamIdByIdParams & {
    // path
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string; data?: number }>(`/stream/${param0}/name`, {
    method: 'PATCH',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /stream/${param0} */
export async function StreamControllerDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.StreamControllerDeleteParams & {
    // path
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string; data?: number }>(`/stream/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /stream/${param0} */
export async function StreamControllerUpdateStreamById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.StreamControllerUpdateStreamByIdParams & {
    // path
    id: string;
  },
  body: API.StreamDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string; data?: number }>(`/stream/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
