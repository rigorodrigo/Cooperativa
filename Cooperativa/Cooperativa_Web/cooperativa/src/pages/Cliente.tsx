import { useState, useEffect } from "react";
import type { Cliente } from "../types";
import { buscarClientes, excluirCliente } from "../api/clienteService.ts";
import { FormCliente } from "../components/formularioCliente.tsx";
import {FormVendaSacas} from "../components/formularioVendaSacas.tsx";
import {FormTransferirSacas} from "../components/formularioTransferirSacas.tsx";
import '../index.css';

function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [isVendaFormOpen, setIsVendaFormOpen] = useState(false);
    const [clienteVenda, setClienteVenda] = useState<Cliente | null>(null);
    const [isTransfFormOpen, setIsTransfFormOpen] = useState(false);
    const [clienteOrigem,setClienteOrigem] = useState<Cliente | null>(null);


    useEffect(() => {
        const carregarClientes = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await buscarClientes();
                setClientes(response.data);
            } catch (e) {
                console.error("Erro ao carregar clientes:", e);
            } finally {
                setLoading(false);
            }
        };

        carregarClientes();
    }, []);

    const handleExcluir = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este cliente?")) {
            return;
        }

        try {
            await excluirCliente(id);
            setClientes(prev => prev.filter(cliente => cliente.id !== id));
        } catch (e) {
            alert("Falha ao excluir cliente.");
            console.error(e);
        }
    };

    const handleOpenFormCreate = () => {
        setSelectedCliente(null);
        setIsFormOpen(true);
    }

    const handleOpenFormEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsFormOpen(true);
    }

    const handleOpenVendaForm = (cliente: Cliente) => {
        setClienteVenda(cliente);
        setIsVendaFormOpen(true);
    }

    const handleVendaSucess = (message: string) => {
        alert(message);
        setIsVendaFormOpen(false);
        window.location.reload();  // recarregar dados do cliente para atualizar
    }

    const handleOpenTransfForm = (cliente: Cliente) => {
        setClienteOrigem(cliente);
        setIsTransfFormOpen(true);
    }

    const handleTransfSucess = (message: string) => {
        alert(message);
        setIsTransfFormOpen(false);
        window.location.reload();
    }

    const handleSave = (cliente: Cliente) => {
        if (selectedCliente) {
            setClientes(prev => prev.map(c => c.id === cliente.id ? cliente : c));
        } else {
            setClientes(prev => [...prev, cliente]);
        }
        setIsFormOpen(false);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="main-content">
                    <div className="card text-center">
                        <div className="loading"></div>
                        <p className="mt-2">Carregando clientes...</p>
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
                                <h1 className="card-title">Clientes</h1>
                                <p className="card-subtitle">Gerencie os clientes da cooperativa</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleOpenFormCreate}
                            >
                                + Adicionar Cliente
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        {clientes.length === 0 ? (
                            <div className="text-center p-3">
                                <p className="text-secondary">Nenhum cliente cadastrado.</p>
                                <button 
                                    className="btn btn-secondary mt-2"
                                    onClick={handleOpenFormCreate}
                                >
                                    Cadastrar Primeiro Cliente
                                </button>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            <th>Telefone</th>
                                            <th>Cidade/UF</th>
                                            <th>Nº de Sacas</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.map((cliente) => (
                                            <tr key={cliente.id}>
                                                <td>{cliente.nome}</td>
                                                <td>{cliente.cpf}</td>
                                                <td>{cliente.telefone}</td>
                                                <td>{cliente.endereco}{cliente.cep ? `, CEP: ${cliente.cep}` : ''}</td>
                                                <td className="text-center">
                                                    {cliente.sacas ? cliente.sacas.length : 0}
                                                </td>
                                                <td>
                                                    <div className="d-flex" style={{ gap: '8px' }}>
                                                        <button 
                                                            className="btn btn-small btn-outline"
                                                            onClick={() => handleOpenFormEdit(cliente)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            className="btn btn-small btn-warning"
                                                            onClick={() => handleOpenVendaForm(cliente)}
                                                        >
                                                            Vender
                                                        </button>
                                                        <button
                                                            className="btn btn-small btn-secondary"
                                                            onClick={() => handleOpenTransfForm(cliente)}
                                                        >
                                                            Transferir
                                                        </button>
                                                        <button
                                                            className="btn btn-small btn-error"
                                                            onClick={() => handleExcluir(cliente.id)}
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

            {isFormOpen &&   (
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
                    <FormCliente
                        cliente={selectedCliente}
                        onClose={() => setIsFormOpen(false)}
                        onSave={handleSave}
                    />
                </div>
            )}

            {isVendaFormOpen && clienteVenda && (
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
                    <FormVendaSacas
                        cliente={clienteVenda}
                        onClose={() => setIsVendaFormOpen(false)}
                        onSucess={handleVendaSucess}
                    />
                </div>
            )}

            {isTransfFormOpen && clienteOrigem && (
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
                    <FormTransferirSacas
                        clienteOrigem={clienteOrigem}
                        onClose={() => setIsTransfFormOpen(false)}
                        onSuccess={handleTransfSucess}
                    />
                </div>
            )}
        </div>
    );
}

export default ClientesPage;