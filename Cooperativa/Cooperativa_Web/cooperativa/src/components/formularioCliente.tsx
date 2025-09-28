import  {useState} from "react";
import type {Cliente} from "../types";
import {criarCliente,atualizarCliente} from "../api/clienteService.ts";
//import InputMask from "react-input-mask";
import {IMaskInput} from "react-imask";


interface  clienteProps {
    cliente: Omit<Cliente, 'id'| 'sacas'> | Partial<Cliente> | null;
    onClose: () => void;
    onSave: (cliente: Cliente) => void;
}

export function FormCliente({cliente, onClose, onSave}: clienteProps) {
    const [formData,setFormData] = useState({
        nome: '',
        cpf: '',
        data_nasc: '',
        endereco: '',
        cep: '',
        telefone: '',
        ...cliente
    })

    const isEditing = cliente && 'id' in cliente;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleMaskChange = (name: string, value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let savedCliente;
            if(isEditing) {
                const response = await atualizarCliente(cliente.id!, formData);
                savedCliente = response.data;
            }else {
                const response = await criarCliente(formData);
                savedCliente = response.data;
            }
            onSave(savedCliente);
            onClose();
        } catch (e) {
            console.error("Não foi possível salvar o cliente.",e);
            alert("Não foi possível salvar o cliente. Verifique os dados e tente novamente.");
        }
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                <h2>{isEditing ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
                <form onSubmit={handleSubmit}>

                    <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
                    <IMaskInput mask="000.000.000-00" name="cpf" value={formData.cpf} onAccept={(value) => handleMaskChange('cpf',value)} placeholder="CPF" required />
                    <input type="date" name = "data_nasc" value={formData.data_nasc} onChange={handleChange} placeholder="Data de Nascimento" required />
                    <input name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" required />
                    <IMaskInput mask="00000-000" name="cep" value={formData.cep} onAccept={(value) => handleMaskChange('cep',value)} placeholder="CEP" required />
                    <IMaskInput mask="(00) 00000-0000" name="telefone" value={formData.telefone} onAccept={(value) => handleMaskChange('telefone', value)} placeholder="Telefone" required />

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" style={{color: 'green'}}>{isEditing ? 'Salvar Alterações' : 'Criar Cliente'}</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '1rem' , color: 'red'}}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}