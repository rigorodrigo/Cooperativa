import { isDate } from 'brazilian-values';
import { IsNotEmpty, IsString, IsOptional, Matches,IsDateString } from 'class-validator';
import { IsCPF } from "class-validator-cpf";


export class CreateClienteDTO {

    @IsNotEmpty ({message: 'Nome é obrigatório!'})
    @IsString()
    nome!: string;

    @IsNotEmpty ( { message: 'CPF  é obrigatório!'})
    @IsCPF({ message: 'CPF inválido!'})
    cpf !: string;

     @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
    @IsDateString({}, { message: 'Data inválida!' })
    data_nasc!: string;

    @IsNotEmpty({ message: 'O endereço (número e complemento) é obrigatório.' })
    @IsString()
    endereco!: string;

    @IsNotEmpty({ message: 'O CEP é obrigatório.' })
    @Matches(/^[0-9]{5}-[0-9]{3}$/, { message: 'CEP inválido.' })           // regex para cep do regexr.com
    cep!: string;

    @IsNotEmpty({ message: 'O telefone é obrigatório.' })
    @IsString()
    telefone!: string;
}

export class UpdateClienteDTO {

    @IsOptional() @IsString()
    nome?: string;

    @IsOptional() @IsCPF()
    cpf?: string;

    @IsOptional() @IsDateString()
    data_nasc?: string;

    @IsOptional() @IsString()
    endereco?: string;

    @IsOptional() @IsString()
    @Matches (/^[0-9]{5}-[0-9]{3}$/, {message: 'CEP inválido!'})
    cep?: string;

    @IsOptional () @IsString()
    telefone?: string;
}