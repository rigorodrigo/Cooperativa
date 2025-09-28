import {useState,useEffect} from "react";
import {Link} from "react-router";
import "../index.css";
import {buscarSacas} from "../api/sacaService.ts";
import {buscarClientes} from "../api/clienteService.ts";
import {buscarCulturas} from "../api/culturaService.ts";

interface Estatisticas {
    totalSacas: number;
    totalClientes: number;
    totalCulturas: number;
    sacasPorCultura: Record<string, number>;
}

function HomePage() {

    const [estatisticas,setEstatisticas] = useState<Estatisticas>({
        totalSacas: 0,
        totalClientes: 0,
        totalCulturas: 0,
        sacasPorCultura: {}
    });

    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const carregarDashBoard = async () => {
            try {
                setLoading(true);

                const [resClientes,resCulturas,resSacas] = await Promise.all([
                    buscarClientes(),
                    buscarCulturas(),
                    buscarSacas()
                ])

                const clientes = resClientes.data;
                const culturas = resCulturas.data;
                const sacas = resSacas.data;
                const sacasPorCultura: Record<string, number> = {};

                sacas.forEach(saca => {
                    const cultura = culturas.find(c => c.nome=== saca.cultura.nome);
                    if (cultura) {
                        sacasPorCultura[cultura.nome] = (sacasPorCultura[cultura.nome] || 0) + 1;
                    }
                })

                setEstatisticas({
                    totalSacas : sacas.length,
                    totalCulturas: culturas.length,
                    totalClientes: clientes.length,
                    sacasPorCultura
                })
            }catch (e) {
                console.error("Erro ao carregar dashboard:",e);
            } finally {
                setLoading(false);
            }
        }

        carregarDashBoard();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <div className="main-content">
                    <div className="card text-center">
                        <div className="loading"></div>
                        <p className="mt-2">Carregando dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="main-content">
                <div className="card-header mb-3">
                    <h1 className="card-title" >Dashboard - Cooperativa Agrícola</h1>
                    <p className="card-subtitle">Visão geral do sistema</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <Link to="/clientes" style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '3rem', color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }}>
                                👥
                            </div>
                            <h3 className="text-primary">{estatisticas.totalClientes}</h3>
                            <p className="text-secondary">Clientes Cadastrados</p>
                        </div>
                    </Link>

                    <Link to="/culturas" style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '3rem', color: 'var(--accent-yellow)', marginBottom: 'var(--spacing-md)' }}>
                                🌾
                            </div>
                            <h3 className="text-warning">{estatisticas.totalCulturas}</h3>
                            <p className="text-secondary">Tipos de Culturas</p>
                        </div>
                    </Link>

                    <Link to="/sacas" style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 'var(--spacing-md)' }}>
                                📦
                            </div>
                            <h3 className="text-success">{estatisticas.totalSacas}</h3>
                            <p className="text-secondary">Sacas Armazenadas</p>
                        </div>
                    </Link>
                </div>

                {Object.keys(estatisticas.sacasPorCultura).length > 0 && (
                    <div className="card">
                        <h3 className="card-title mb-3">Sacas por Cultura</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 'var(--spacing-md)'
                        }}>
                            {Object.entries(estatisticas.sacasPorCultura).map(([cultura, quantidade]) => (
                                <div key={cultura} className="p-2" style={{
                                    background: 'var(--light-green)',
                                    borderRadius: 'var(--border-radius)',
                                    textAlign: 'center'
                                }}>
                                    <strong>{cultura}</strong>
                                    <div style={{ fontSize: '1.5rem', color: 'var(--primary-green)' }}>
                                        {quantidade} sacas
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <div className="card">
                    <h3 className="card-title mb-3">Ações Rápidas</h3>
                    <div className="btn-group" style={{ flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                        <Link to="/clientes" className="btn btn-primary">
                            👥 Gerenciar Clientes
                        </Link>
                        <Link to="/culturas" className="btn btn-secondary">
                            🌾 Gerenciar Culturas
                        </Link>
                        <Link to="/sacas" className="btn btn-outline">
                            📦 Gerenciar Sacas
                        </Link>
                    </div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, var(--light-green) 0%, var(--secondary-green) 100%)',
                    textAlign: 'center',
                    marginTop: 'var(--spacing-xl)'
                }}>
                    <h4 className="text-primary mb-2">Sistema de Gestão de Cooperativa Agrícola</h4>
                    <p className="text-secondary">
                        Gerencie clientes, culturas e armazenamento de sacas de forma eficiente e integrada.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;