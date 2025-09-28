import { Request, Response } from 'express'
import { appDataSource } from '@config/data_source'
import { Saca } from '@entities/Saca'
import { validate } from 'class-validator';
import { CreateSacaDTO, UpdateSacaDTO } from '@dtos/SacaDTO';
import { SacaService } from '@services/sacaService';

const repo = appDataSource.getRepository(Saca);

export class SacaController {
    static async listar(req: Request, res: Response) {
        const sacas = await repo.find({ order: { id: 'ASC' } , relations: ['cliente', 'cultura']});
        res.json(sacas);
    }

    static async buscarSaca(req: Request, res: Response) {
        const id = Number(req.params.id);
        const saca = await repo.findOne({ where: {id}, relations: {cliente: true, cultura: true} });
        res.json(saca);
    }

    static async criar(req: Request, res: Response) {
        const dados = Object.assign(new CreateSacaDTO(), req.body);
        const erros = await validate(dados);
        if (erros.length > 0) return res.status(400).json(erros);
        try {
            const saca = await SacaService.criar(dados);
            res.status(201).json(saca);
        }
        catch (err: any) {
            console.log(err);
            res.status(500).json({ message: 'Erro no servidor!' });
        }
    }

    static async atualizar(req: Request, res: Response) {
        const id = Number(req.params.id);
        const dados = Object.assign(new UpdateSacaDTO(), req.body);
        const erros = await validate(dados);
        if (erros.length > 0) return res.status(400).json(erros);
        try {
            const saca = await SacaService.atualizar(id, dados);
            res.status(200).json(saca)
        }

        catch (err: any) {
            console.log(err);
            res.status(500).json({ message: 'Erro no servidor!' });
        }
    }

    static async excluir(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const apagar = await SacaService.excluir(id);
            res.status(204).send();
        } catch (error: any) {
            console.log(error);
            res.status(500).json('Erro no servidor');
        }
    }
}