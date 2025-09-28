import { useState, useEffect } from 'react';
import type { Cliente, Cultura } from '../types';
import { buscarClientes, transferirSacas } from '../api/clienteService';
import { buscarCulturas } from '../api/culturaService';

interface Props {
    clienteOrigem: Cliente;
    onClose: () => void;
    onSuccess: (message: string) => void;
}

export function FormTransferirSacas({ clienteOrigem, onClose, onSuccess }: Props) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [culturas, setCulturas] = useState<Cultura[]>([]);
    const [clienteDestinoId, setClienteDestinoId] = useState('');
    const [culturaId, setCulturaId] = useState('');
    const [numSacas, setNumSacas] = useState(1);


    useEffect(() => {
        async function carregarDados() {
            const resClientes = await buscarClientes();
            setClientes(resClientes.data.filter(c => c.id !== clienteOrigem.id)); // cliente  origem não aparece na lista

            const resCulturas = await buscarCulturas();
            setCulturas(resCulturas.data);
        }
        carregarDados();
    }, [clienteOrigem.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clienteDestinoId || !culturaId) {
            alert('Por favor, selecione o destino e a cultura.');
            return;
        }

        const dados = {
            clienteDestinoId: Number(clienteDestinoId),
            culturaId: Number(culturaId),
            numSacas,
        };

        try {
            const response = await transferirSacas(clienteOrigem.id, dados);
            onSuccess(response.data.message);
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            alert(err.response?.data?.message || 'Erro ao transferir sacas.');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h3>Transferir Sacas de: {clienteOrigem.nome}</h3>
                <form onSubmit={handleSubmit}>
                    {/* Campo para selecionar o cliente de destino */}
                    <select value={clienteDestinoId} onChange={e => setClienteDestinoId(e.target.value)} required>
                        <option value="">Selecione o cliente de destino</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>

                    {/* Campo para selecionar a cultura */}
                    <select value={culturaId} onChange={e => setCulturaId(e.target.value)} required>
                        <option value="">Selecione a cultura</option>
                        {culturas.map(cult => <option key={cult.id} value={cult.id}>{cult.nome}</option>)}
                    </select>

                    {/* Campo para o número de sacas */}
                    <input
                        type="number"
                        value={numSacas}
                        onChange={e => setNumSacas(Number(e.target.value))}
                        min="1"
                        required
                    />

                    <button type="submit">Transferir</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
}