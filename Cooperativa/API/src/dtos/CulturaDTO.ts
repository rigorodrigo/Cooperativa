import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCulturaDTO {
    @IsNotEmpty({ message: 'Nome é obrigatório!' })
    @IsString()
    nome!: string;

    @IsNotEmpty({ message: 'Valor da saca é obrigatório!' })
    @IsNumber()
    valor_saca!: number;
}

export class UpdateCulturaDTO {
    @IsOptional() @IsString()
    nome?: string;

    @IsOptional() @IsNumber()
    valor_saca?: number;
}