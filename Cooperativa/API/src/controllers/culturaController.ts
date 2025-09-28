import { Request, Response } from 'express'
import { appDataSource } from '@config/data_source'
import { Cultura } from '@entities/Cultura'
import { CreateCulturaDTO, UpdateCulturaDTO } from '@dtos/CulturaDTO';
import { CulturaService } from '@services/culturaService';
import { validate } from 'class-validator';

const repo = appDataSource.getRepository(Cultura);

export class CulturaController {
    static async listar(req: Request, res: Response) {
        const culturas = await repo.find({ order: { id: 'ASC' } });
        res.json(culturas);
    }

    static async buscarCultura(req: Request, res: Response) {
        const id = Number(req.params.id);
        const cultura = await repo.findOne({ where: { id }, relations: { sacas: true } })
        res.json(cultura);
    }

    static async criar(req: Request, res: Response) {
        const dados = Object.assign(new CreateCulturaDTO(), req.body);
        const erros = await validate(dados);
        if (erros.length > 0) return res.status(400).json(erros);
        try {
            const cultura = await CulturaService.criar(dados);
            res.status(201).json(cultura);
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ message: 'Erro no servidor!' });
        }
    }

    static async atualizar(req: Request, res: Response) {
        const id = Number(req.params.id);
        const dados = Object.assign(new UpdateCulturaDTO(), req.body);
        const erros = await validate(dados);
        if (erros.length > 0) return res.status(400).json(erros);
        try {
            const cultura = await CulturaService.atualizar(id, dados);
            res.status(200).json(cultura)
        }

        catch (err: any) {
            console.log(err);
            res.status(500).json({ message: 'Erro no servidor!' });
        }
    }

    static async excluir(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const apagar = await CulturaService.excluir(id);
            res.status(204).send();
        } catch (error: any) {
            console.log(error);
            res.status(500).json('Erro no servidor');
        }
    }
}