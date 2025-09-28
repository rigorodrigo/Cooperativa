import { Request, Response} from 'express'
import { appDataSource } from '@config/data_source'
import { Cliente} from '@entities/Cliente'
import { ClienteService } from '@services/clienteService';
import { CreateClienteDTO, UpdateClienteDTO } from '@dtos/ClienteDTO';
import { validate } from 'class-validator';

const repo = appDataSource.getRepository(Cliente);

export class ClienteController {
    static async listar ( req: Request, res: Response) {
        const clientes = await repo.find({ order: { id: 'ASC'}, relations: ['sacas']});
        res.json(clientes);
    }

    static async buscarCliente ( req: Request, res: Response) {
        const id = Number(req.params.id);
        const cliente = await repo.findOne({ where: {id}, relations: {sacas: true}})
        res.json(cliente);
    }

    static async criar (req: Request, res: Response){
        const dados = Object.assign ( new CreateClienteDTO(), req.body);
        const erros = await validate(dados)
        if (erros.length > 0) {
            return res.status(400).json(erros);
        }
        try {
            const cliente = await ClienteService.criar(dados);
            res.status(201).json(cliente);
        } catch (error: any) {
            res.status(400).json({message: error.message})
        }
    }

    static async atualizar (req: Request, res: Response) {
        const id = Number(req.params.id);
        const dados = Object.assign(new UpdateClienteDTO(),req.body);
        const erros = await validate(dados);
        if (erros.length > 0) return res.status(400).json(erros);
        try{
            const salvo = await ClienteService.atualizar(id,dados)
            res.status(200).json(salvo);
        }

        catch(err:any) {
            console.log(err);
            res.status(400).json({message: err.message});
        }
    }

    static async excluir (req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const apagar = await ClienteService.excluir(id);
            res.status(204).send();
        } catch (error: any) {
            console.log(error);
            res.status(500).json('Erro no servidor');
        }
    }

    static async transferirSacas (req: Request, res: Response) {
        const id = Number(req.params.id);
        const  {clienteDestinoId,numSacas,culturaId} = req.body;

        try {
            const transferir  = await ClienteService.transferirSacas(id,clienteDestinoId,numSacas,culturaId);
            res.status(200).json(transferir);
        } catch (error: any) {
            console.log(error);
            res.status(500).json('Erro no servidor')
        }
    }

    static async venderSacas (req: Request, res: Response) {
        const id = Number(req.params.id);
        const {numSacas, culturaId} = req.body;
        try {
            const venda = await ClienteService.venderSacas(id,numSacas,culturaId)
            res.status(200).json(venda);
        } catch (error: any) {
            console.log(error);
            res.status(500).json('Erro no servidor')
        }
    }
}