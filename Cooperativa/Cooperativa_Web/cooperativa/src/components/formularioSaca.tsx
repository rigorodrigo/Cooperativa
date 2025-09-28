import {useState,useEffect} from "react";
import type {Saca,Cliente,Cultura,CriarSacaData} from "../types";
import {criarSaca,atualizarSaca} from "../api/sacaService.ts";
import {buscarCulturas} from "../api/culturaService.ts";
import {buscarClientes} from "../api/clienteService.ts";

interface FormSacaProps  {
    saca: Saca | null;
    onClose: () => void;
    onSave: (saca: Saca) => void;
}

export function FormSaca({saca, onClose, onSave} :FormSacaProps) {

    const [formData,setFormData] = useState({
        peso_kg: saca?.peso_kg || 60,
        data_armazenamento:  saca ? saca.data_armazenamento.split('T')[0] : new Date().toISOString().split('T')[0],
        cliente: saca?.cliente?.id || '',
        cultura: saca?.cultura?.id || '',
    })

    // Estados para armazenar as listas de clientes e culturas
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [culturas, setCulturas] = useState<Cultura[]>([]);

    const  isEditing = !!saca;

    useEffect(() => {
        const carregarDados = async () => {
            const clientes = await buscarClientes();
            const culturas = await buscarCulturas();
            setClientes(clientes.data);
            setCulturas(culturas.data);
        }

        carregarDados();
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name,value} = e.target;
        setFormData(prev => ({...prev,[name]: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload : CriarSacaData =  {
            ...formData,
            cliente: Number(formData.cliente),
            cultura: Number(formData.cultura),
        }

        try{
            let savedSaca;
            if(isEditing){
                const response = await atualizarSaca(saca!.id,payload);
                savedSaca = response.data;
            } else{
                const response = await criarSaca(payload);
                savedSaca = response.data;
            }

            onSave(savedSaca);
        } catch (e) {
            alert("Falha ao salvar saca. Verifique os dados e tente novamente.");
            console.error(e);
        }
    }

    return  (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h2>{isEditing ? 'Editar Saca' : 'Adicionar Saca'}</h2>
                <form onSubmit={handleSubmit}>

                    <select name="cliente" value={formData.cliente} onChange={handleChange} required>
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>

                    <select name="cultura" value={formData.cultura} onChange={handleChange} required>
                        <option value="">Selecione uma Cultura</option>
                        {culturas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>

                    <input name="peso_kg" type="number" value={formData.peso_kg} onChange={handleChange} placeholder="Peso (kg)" required />
                    <input name="data_armazenamento" type="date" value={formData.data_armazenamento} onChange={handleChange} required />

                    <button type="submit">{isEditing ? 'Salvar' : 'Criar'}</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    )
}
