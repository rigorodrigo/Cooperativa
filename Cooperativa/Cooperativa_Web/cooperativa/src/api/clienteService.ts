import api from './api.ts';
import type {Cliente, CriarClienteData, TransferirSacasData, VenderSacasData} from "../types";

export const buscarClientes = async () => api.get<Cliente[]>('/api/clientes');
export const buscarClienteId =  async  (id: number) => api.get<Cliente>(`/api/clientes/${id}`);
export const criarCliente =  async (data: CriarClienteData) => api.post('/api/clientes', data);
export const atualizarCliente = async  (id: number, data: Partial<Cliente>) => api.put(`/api/clientes/${id}`, data);
export const excluirCliente = async  (id:number) => api.delete(`/api/clientes/${id}`);
export const transferirSacas = async (id: number, dados: TransferirSacasData) => api.post(`/api/clientes/${id}/transferir-sacas`,dados);
export const venderSacas = async (id:number, dados: VenderSacasData ) => api.post(`/api/clientes/${id}/vender-sacas`,dados);