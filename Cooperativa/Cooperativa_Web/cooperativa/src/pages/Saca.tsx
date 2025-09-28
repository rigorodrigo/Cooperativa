import {useState,useEffect} from "react";
import type {Saca} from "../types";
import {buscarSacas,excluirSaca} from "../api/sacaService.ts";
import "../index.css"
import {FormSaca} from "../components/formularioSaca.tsx";

function SacasPage () {
    const [sacas, setSacas] = useState<Saca[]>([]);
    const[loading,setLoading]= useState(true);
    const[error,setError] = useState<string | null>(null);
    const [isFormOpen,setIsFormOpen] = useState(false);
    const [selectedSaca, setSelectedSaca] = useState<Saca | null> (null);

    useEffect(() => {
        const carregarSacas = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await buscarSacas();
                setSacas(response.data);
            } catch (e) {
                console.error("Erro ao carregar sacas",e);
            } finally {
                setLoading(false);
            }
        }

        carregarSacas();
    }, []);

    const handleExcluir = async  (id:number) => {
        if(!window.confirm("Tem certeza que deseja excluir esta saca?")) {
            return;
        }
        try {
            await excluirSaca(id);
            setSacas(prev => prev.filter(saca => saca.id !== id));
        } catch (e) {
            alert("Falha ao excluir saca.");
            console.error(e);
        }
    }

    const handleOpenFormCreate = () => {
        setSelectedSaca(null);
        setIsFormOpen(true);
    }
    const handleOpenFormEdit = (saca: Saca) => {
        setSelectedSaca(saca);
        setIsFormOpen(true);
    }

    const handleSave = (saca: Saca) => {
        const isExisting = sacas.some(s=> s.id === saca.id);
        if (isExisting) {
            setSacas(prev => prev.map(s=> s.id === saca.id ? saca : s));
        } else{
            setSacas(prev => [...prev,saca]);
        }
        setIsFormOpen(false);
    }

    if(loading){
        return (
            <div className="container">
                <div className="main-content">
                    <div className="card text-center">
                        <div className="loading"></div>
                        <p className="mt-2">Carregando sacas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error){
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
                                <h1 className="card-title">Sacas Armazenadas</h1>
                                <p className="card-subtitle">Gerencie as sacas que estão armazenadas na cooperativa</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleOpenFormCreate}
                            >
                                + Adicionar Saca
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
                            <FormSaca
                                saca={selectedSaca}
                                onClose={() => setIsFormOpen(false)}
                                onSave={handleSave}
                            />
                        </div>
                    )}

                    <div className="card">
                        {sacas.length === 0 ? (
                            <div className="text-center p-3">
                                <p className="text-secondary">Nenhuma saca cadastrada.</p>
                                <button
                                    className="btn btn-secondary mt-2"
                                    onClick={handleOpenFormCreate}
                                >
                                    Cadastrar Primeira Saca
                                </button>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Cultura </th>
                                        <th>Peso (kg) </th>
                                        <th>Data de Armazenamento </th>
                                        <th>Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sacas.map((saca) => (
                                        <tr key={saca.id}>
                                            <td>{saca.cliente?.nome || 'N/A'}</td>
                                            <td>{saca.cultura?.nome || 'N/A'}</td>
                                            <td>{saca.peso_kg}</td>
                                            <td>{new Date(saca.data_armazenamento).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex" style={{ gap: '8px' }}>
                                                    <button
                                                        className="btn btn-small btn-outline"
                                                        onClick={() => handleOpenFormEdit(saca)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-small btn-error"
                                                        onClick={() => handleExcluir(saca.id)}
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

export default SacasPage;