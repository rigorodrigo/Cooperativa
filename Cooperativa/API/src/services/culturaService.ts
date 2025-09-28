import { appDataSource } from '@config/data_source'
import { Cultura } from '@entities/Cultura'
import { CreateCulturaDTO, UpdateCulturaDTO } from '@dtos/CulturaDTO'
import { Not } from 'typeorm';

const repo = appDataSource.getRepository(Cultura);

export class CulturaService {
    static async criar(dados: CreateCulturaDTO): Promise<Cultura> {
        if (await repo.findOneBy({ nome: dados.nome })) {
            throw new Error('Nome de cultura já cadastrado.');
        }
        const cultura = repo.create(dados);
        await repo.save(cultura);
        return cultura;
    }

    static async atualizar(id: number, dados: UpdateCulturaDTO): Promise<Cultura> {
        const cultura = await repo.findOneBy({ id });
        if (!cultura) throw new Error('Cultura não encontrada.');

        if (dados.nome && await repo.findOne({ where: { nome: dados.nome, id: Not(id) } })) {
            throw new Error('Nome de cultura já cadastrado!');
        }

        repo.merge(cultura, dados);
        await repo.save(cultura);
        return cultura;
    }

    static async excluir(id: number) {
        const cultura = await repo.findOne({ where: { id }, relations: ['sacas'] });
        if (!cultura) throw new Error('Cultura não encontrada.');
        await repo.delete(id);
    }
}