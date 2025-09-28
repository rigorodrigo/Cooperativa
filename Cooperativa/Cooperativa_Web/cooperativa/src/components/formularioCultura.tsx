import { useState } from 'react';
import type { Cultura } from '../types';
import { criarCultura, atualizarCultura } from '../api/culturaService';


type CreateCulturaData = Omit<Cultura, 'id' | 'sacas'>;

interface FormCulturaProps {
    cultura: Cultura | null;
    onClose: () => void;
    onSave: (cultura: Cultura) => void;
}

export function FormCultura({ cultura, onClose, onSave }: FormCulturaProps) {
    const [formData, setFormData] = useState<CreateCulturaData>({
        nome: cultura?.nome || '',
        valor_saca: cultura?.valor_saca || 0,
    });

    const isEditing = !!cultura;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'valor_saca' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let savedCultura;
            if (isEditing) {
                const response = await atualizarCultura(cultura.id!, formData);
                savedCultura = response.data;
            } else {
                const response = await criarCultura(formData);
                savedCultura = response.data;
            }
            onSave(savedCultura);
            onClose();
        } catch (error) {
            console.error('Falha ao salvar cultura:', error);
            alert('Não foi possível salvar a cultura. Verifique os dados.');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                <h2>{isEditing ? 'Editar Cultura' : 'Adicionar Cultura'}</h2>
                <form onSubmit={handleSubmit}>

                    <input
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Nome da Cultura"
                        required
                    />
                    <input
                        name="valor_saca"
                        type="number"
                        step="0.01"
                        value={formData.valor_saca}
                        onChange={handleChange}
                        placeholder="Valor da Saca (R$)"
                        required
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" style={{ color: 'green' }}>{isEditing ? 'Salvar Alterações' : 'Criar Cultura'}</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '1rem', color: 'red' }}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}