import { appDataSource } from '@config/data_source'
import { Saca } from '@entities/Saca'
import { CreateSacaDTO, UpdateSacaDTO } from '@dtos/SacaDTO'
import { Cliente } from '@entities/Cliente';
import { Cultura } from '@entities/Cultura';

const repo = appDataSource.getRepository(Saca);

export class SacaService {
    static async criar(dados: CreateSacaDTO): Promise<Saca> {
        // Validar se cliente e cultura existem
        const clienteRepo = appDataSource.getRepository(Cliente);
        const culturaRepo = appDataSource.getRepository(Cultura);
        
        const cliente = await clienteRepo.findOneBy({ id: dados.cliente });
        const cultura = await culturaRepo.findOneBy({ id: dados.cultura });
        
        if (!cliente) throw new Error('Cliente não encontrado!');
        if (!cultura) throw new Error('Cultura não encontrada!');
        
        const saca = repo.create({
            peso_kg: dados.peso_kg,
            data_armazenamento: dados.data_armazenamento,
            cliente: cliente,
            cultura: cultura
        });
        
        await repo.save(saca);
        return saca;
    }
    static async atualizar(id: number, dados: UpdateSacaDTO): Promise<Saca> {
        const saca = await repo.findOneBy({ id });
        if (!saca) throw new Error('Saca não encontrada.');


        const updateData: any = { ...dados };

        if (dados.cliente !== undefined) {
            const clienteRepo = appDataSource.getRepository(Cliente);
            const cliente = await clienteRepo.findOneBy({ id: dados.cliente });
            if (!cliente) throw new Error('Cliente não encontrado!');
            updateData.cliente = cliente;
        }
        if (dados.cultura !== undefined) {
            const culturaRepo = appDataSource.getRepository(Cultura);
            const cultura = await culturaRepo.findOneBy({ id: dados.cultura });
            if (!cultura) throw new Error('Cultura não encontrada!');
            updateData.cultura = cultura;
        }

        repo.merge(saca, updateData);
        await repo.save(saca);
        return saca;
    }

    static async excluir(id: number) {
        const saca = await repo.findOneBy({ id });
        if (!saca) throw new Error('Saca não encontrada.');
        await repo.delete(id);
    }
}