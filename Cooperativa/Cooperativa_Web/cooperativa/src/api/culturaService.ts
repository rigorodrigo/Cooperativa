import api from './api.ts'
import type {CriarCulturaData, Cultura} from "../types";

export const buscarCulturas = async() => api.get<Cultura[]>('/api/culturas');
export const buscarCulturaId = async (id: number) => api.get(`/api/culturas/${id}`);
export const criarCultura = async (data: CriarCulturaData) => api.post('/api/culturas',data);
export const atualizarCultura = async (id:number,data: Partial<Cultura>) => api.put(`/api/culturas/${id}`, data);
export  const  excluirCultura = async (id: number) => api.delete(`/api/culturas/${id}`);