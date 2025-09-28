import {useEffect,useState} from "react";
import type {Cliente,Cultura} from "../types";
import {venderSacas} from "../api/clienteService.ts";
import {buscarCulturas} from "../api/culturaService.ts";

interface FormVendaSacas {
    cliente: Cliente;
    onClose: () => void;
    onSucess: (message: string) => void;
}

export function FormVendaSacas({cliente,onClose,onSucess}: FormVendaSacas) {
    const [culturas,setCulturas] = useState<Cultura[]>([]);
    const [numSacas,setNumSacas] = useState(1);
    const [culturaId,setCulturaId] = useState('');

    useEffect(() => {
        async function carregarCulturas() {
            const response = await buscarCulturas()
            setCulturas(response.data);
        }

        carregarCulturas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!culturaId) {
            alert('Por favor, selecione uma cultura');
            return;
        }

        const dados = {
            culturaId : Number(culturaId),
            numSacas
        }

        try {
            const response = await venderSacas(cliente.id,dados);
            onSucess(response.data.message);
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            alert(err.response?.data?.message || 'Erro ao transferir sacas.');
        }
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h3>Vender Sacas de: {cliente.nome}</h3>
                <form onSubmit={handleSubmit}>
                    <select value={culturaId} onChange={e => setCulturaId(e.target.value)} required>
                        <option value="">Selecione a cultura</option>
                        {culturas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    <input type="number" value={numSacas} onChange={e => setNumSacas(Number(e.target.value))} min="1" required />
                    <button type="submit">Vender</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    )
}