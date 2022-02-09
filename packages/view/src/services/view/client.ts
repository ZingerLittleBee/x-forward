// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /client/${param0} */
export async function ClientControllerGetById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ClientControllerGetByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string; data?: API.ClientVo }>(
    `/client/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /client */
export async function ClientControllerRegister(
  body: API.CreateClientDto,
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean; message?: string; data?: string }>('/client', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
