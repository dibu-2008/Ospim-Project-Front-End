import { axiosCrud } from '@/components/axios/axiosCrud';

export const error401 =async () =>{
    response = await axiosCrud.consultar('/error/401')
    return response
}