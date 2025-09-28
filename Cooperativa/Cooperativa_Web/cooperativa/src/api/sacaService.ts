import api from './api.ts'
import type {AtualizarSacaData, CriarSacaData, Saca} from "../types";

export const buscarSacas = async () => api.get<Saca[]>('/api/sacas');
export const buscarSacasId = async (id:number) => api.get(`/api/sacas/${id}`);
export const criarSaca = async (data: CriarSacaData) => api.post('/api/sacas',data);
export const atualizarSaca = async (id: number, data:  AtualizarSacaData) => api.put(`/api/sacas/${id}`,data);
export const excluirSaca = async (id: number) => api.delete(`/api/sacas/${id}`);