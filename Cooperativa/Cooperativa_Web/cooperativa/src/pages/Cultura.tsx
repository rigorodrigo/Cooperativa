import {useState,useEffect} from "react";
import type {Cultura} from "../types";
import {buscarCulturas,excluirCultura} from "../api/culturaService.ts";
import "../index.css"
import {FormCultura} from "../components/formularioCultura.tsx";

function CulturasPage () {
    const [culturas,setCulturas] = useState<Cultura[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCultura, setSelectedCultura] = useState<Cultura | null>(null);

    useEffect(() => {
        const carregarCulturas = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await buscarCulturas();
                setCulturas(response.data);
            }catch (e) {
                console.error("Erro ao carregar culturas:",e);
            }finally {
                setLoading(false);
            }
        }

        carregarCulturas();
    }, []);

    const handleExcluir = async (id: number) => {
        if(!window.confirm("Tem certeza que deseja excluir esta cultura?")) {
            return;
        }
        try {
            await excluirCultura(id);
            setCulturas(prev => prev.filter(cultura => cultura.id !== id));
        }catch (e) {
            alert("Falha ao excluir cultura.");
            console.error(e);
        }
    }

    const handleOpenFormCreate = () => {
        setSelectedCultura(null);
        setIsFormOpen(true);
    }

    const handleOpenFormEdit = (cultura: Cultura) => {
        setSelectedCultura(cultura);
        setIsFormOpen(true);
    }

    const handleSave = (cultura: Cultura) => {
        if (selectedCultura) {
            setCulturas(prev => prev.map(c => c.id === cultura.id ? cultura : c));
        } else {
            setCulturas(prev => [...prev, cultura]);
        }
        setIsFormOpen(false);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="main-content">
                    <div className="card text-center">
                        <div className="loading"></div>
                        <p className="mt-2">Carregando culturas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="main-content">
                    <div className="alert alert-error">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="main-content">
                <div className="content-wrapper">
                    <div className="card-header">
                        <div className="d-flex justify-between align-center">
                            <div>
                                <h1 className="card-title">Culturas</h1>
                                <p className="card-subtitle">Gerencie as culturas que a cooperativa trabalha</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleOpenFormCreate}
                            >
                                + Adicionar Culturas
                            </button>
                        </div>
                    </div>

                    {isFormOpen && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}>
                            <FormCultura
                                cultura={selectedCultura}
                                onClose={() => setIsFormOpen(false)}
                                onSave={handleSave}
                            />
                        </div>
                    )}

                    <div className="card">
                        {culturas.length === 0 ? (
                            <div className="text-center p-3">
                                <p className="text-secondary">Nenhuma cultura cadastrada.</p>
                                <button
                                    className="btn btn-secondary mt-2"
                                    onClick={handleOpenFormCreate}
                                >
                                    Cadastrar Primeira Cultura
                                </button>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Valor da Saca (60kg) </th>
                                        <th>Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {culturas.map((cultura) => (
                                        <tr key={cultura.id}>
                                            <td>{cultura.nome}</td>
                                            <td>{cultura.valor_saca}</td>
                                            <td>
                                                <div className="d-flex" style={{ gap: '8px' }}>
                                                    <button
                                                        className="btn btn-small btn-outline"
                                                        onClick={() => handleOpenFormEdit(cultura)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-small btn-error"
                                                        onClick={() => handleExcluir(cultura.id)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CulturasPage;