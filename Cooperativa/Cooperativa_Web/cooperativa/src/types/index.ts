export interface  Cliente {
    id: number;
    nome: string;
    cpf: string;
    data_nasc: string;
    cep: string;
    telefone: string;
    endereco: string;
    uf: string;
    cidade: string;
    sacas: Saca[];

}

export interface  Cultura {
    id: number;
    nome: string;
    valor_saca: number;
    sacas : Saca [];
}

export interface  Saca {
    id: number;
    peso_kg: number;
    data_armazenamento: string;
    cliente: Cliente;
    cultura: Cultura;
}

export interface TransferirSacasData {
    clienteDestinoId: number;
    numSacas: number;
    culturaId: number;
}
export interface VenderSacasData {
    numSacas: number;
    culturaId: number;
}

export interface CriarClienteData {
    nome: string;
    cpf: string;
    data_nasc: string;
    endereco: string;
    cep: string;
    telefone: string;
}

export interface CriarCulturaData {
    nome: string;
    valor_saca: number;
}

export interface CriarSacaData {
    peso_kg: number;
    data_armazenamento: string;
    cliente: number;
    cultura: number;
}

export interface AtualizarSacaData {
    peso_kg?: number;
    data_armazenamento?: string;
    cliente?: number;
    cultura?: number;
}