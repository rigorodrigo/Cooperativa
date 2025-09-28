import { Cliente } from '@entities/Cliente';
import { Cultura } from '@entities/Cultura';
import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateSacaDTO {
    @IsNotEmpty({ message: 'Peso é obrigatório!' })
    @IsNumber()
    peso_kg!: number;

    @IsNotEmpty({ message: 'Data de armazenamento é obrigatória!' })
    @IsDateString({}, { message: 'Data inválida!' })
    data_armazenamento!: string;

    @IsNotEmpty({ message: 'Cliente é obrigatório!' })
    @IsNumber()
    cliente!: number;

    @IsNotEmpty({ message: 'Cultura é obrigatória!' })
    @IsNumber()
    cultura!: number;
}

export class UpdateSacaDTO {
    @IsOptional() @IsNumber()
    peso_kg?: number;

    @IsOptional() @IsDateString()
    data_armazenamento?: string;

    @IsOptional() @IsNumber()
    cliente?: number;

    @IsOptional() @IsNumber()
    cultura?: number;
}