import { appDataSource } from '@config/data_source'
import { Cliente } from '@entities/Cliente'
import { CreateClienteDTO, UpdateClienteDTO } from '@dtos/ClienteDTO'
import axios from 'axios';
import { Not } from 'typeorm';
import { Saca } from '@entities/Saca';

const repo = appDataSource.getRepository(Cliente);
const sacaRepo = appDataSource.getRepository(Saca);

export class ClienteService {

    static async criar(dados: CreateClienteDTO): Promise<Cliente> {
        const cpf = dados.cpf.replace(/\D/g, '');
        if (await repo.findOneBy({ cpf: cpf })) {
            throw new Error('Erro. CPF já cadastrado.')
        }
        const cepFormatado = dados.cep.replace(/\D/g, '');
        const { data: infoEndereco } = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);
        if (infoEndereco.erro) {
            throw new Error('CEP não encontrado');
        }

        const cliente = repo.create(
            {
                ...dados,
                cpf,
                cidade: infoEndereco.localidade,
                uf: infoEndereco.uf,
            });

        await repo.save(cliente);
        return cliente;
    }

    static async atualizar(id: number, dados: UpdateClienteDTO): Promise<Cliente> {
        const cliente = await repo.findOneBy({ id });
        if (!cliente) throw new Error('Cliente não encontrado.');

        if (dados.cpf) {
            const cpf = dados.cpf.replace(/\D/g, '');
            if(await repo.findOne({where: {cpf, id: Not(id)}})) {
                throw new Error ('CPF pertence a outro cliente!')
            }

            dados.cpf = cpf;
        }

        repo.merge(cliente, dados);
        await repo.save(cliente);
        return cliente;

    }

    static async excluir(id: number) {
        const cliente = await repo.findOne({ where: { id }, relations: { sacas: true } })
        if (!cliente) throw new Error('Cliente não encontrado.')
        if (cliente.sacas.length > 0) throw new Error('Não é possível excuir o cliente, pois ele possui sacas em seu nome.');
        await repo.delete(id);
    }

    static async transferirSacas(id: number, clienteDestinoId: number, numSacas: number, culturaId: number) {  // método de transferência de saca de um produtor para outro.
        if (id === clienteDestinoId) throw new Error('Clientes origem e destino não podem ser os mesmos!')
        const cliente = await repo.findOne({
            where: { id },
            relations: ['sacas', 'sacas.cultura'] 
        });
        const clienteDestino = await repo.findOneBy({ id: clienteDestinoId });

        if (!cliente) throw new Error('Cliente origem não encontrado!');
        if (!clienteDestino) throw new Error('Cliente destino não encontrado!');

        const sacasCultura = cliente.sacas.filter(saca => saca.cultura.id === culturaId)  //  criando um novo array filtrando as sacas que são da cultura especificada na trasferência
        if (sacasCultura.length < numSacas) throw new Error(`Cliente ${cliente.nome} não possui sacas suficientes para transferir! Ele possui ${sacasCultura.length} sacas desta cultura.`)

        const sacas = sacasCultura.slice(0, numSacas);   // criando um novo array que inicia no indice 0 e vai até numsacas

        for (const saca of sacas) {
            saca.cliente = clienteDestino;
            await sacaRepo.save(saca);
        }

        return { message: `${numSacas} sacas transferidas com sucesso, do produtor ${cliente.nome} para o produtor ${clienteDestino.nome}.` };
    }

    static async venderSacas(id: number, numSacas: number, culturaId: number) {
        const cliente = await repo.findOne({
            where: { id },
            relations: ['sacas', 'sacas.cultura'] 
        });
        if (!cliente) throw new Error('Cliente origem não encontrado!');

        const sacasCultura = cliente.sacas.filter(saca => saca.cultura.id === culturaId);
        if (sacasCultura.length < numSacas) throw new Error(`Cliente ${cliente.nome} não possui a totalidade de sacas que deseja vender! Ele possui ${sacasCultura.length} sacas dessa cultura.`);

        const sacas = sacasCultura.slice(0, numSacas);
        let valorVenda = 0;

        for (const saca of sacas) {
            valorVenda += saca.cultura.valor_saca;
            await sacaRepo.delete(saca.id);
        }

        return { message: `Produtor ${cliente.nome} vendeu ${sacas.length} saca(s) com sucesso. Valor da venda é de R$${valorVenda}. ` }
    }
}   