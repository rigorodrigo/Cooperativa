import { IsNotEmpty, IsString, IsOptional,IsDateString , IsEmail} from 'class-validator';
import { IsCPF } from "class-validator-cpf";

export class CreateColaboradorDTO {

    @IsNotEmpty ({message: 'Nome é obrigatório!'})
    @IsString()
    nome!: string;

    @IsNotEmpty ( { message: 'CPF  é obrigatório!'})
    @IsCPF({ message: 'CPF inválido!'})
    cpf !: string;

     @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
    @IsDateString({}, { message: 'Data inválida!' })
    data_nasc!: string;

    @IsNotEmpty({ message: 'E-mail é obrigatório!'})
    @IsEmail()
    email !: string;

    @IsNotEmpty({ message: 'O telefone é obrigatório.' })
    @IsString()
    telefone!: string;
}

export class updateColaboradorDTO {

    @IsOptional() @IsString()
    nome?: string;

    @IsOptional() @IsCPF()
    cpf?: string;

    @IsOptional() @IsEmail()
    email?: string;

    @IsOptional() @IsDateString()
    data_nasc?: string;

    @IsOptional() @IsString()
    telefone?: string;
}