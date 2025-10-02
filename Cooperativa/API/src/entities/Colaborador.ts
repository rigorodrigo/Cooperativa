import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'colaboradores'})
export class Colaborador {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: 'nome', type: 'varchar', length: 50})
    nome!: string;

    @Column({ type: 'varchar', unique: true, length: 11})
    cpf!: string;

    @Column({name: 'data_nascimento'})
    data_nasc!: Date;

    @Column({type: 'varchar', unique: true, length: 60 })
    email!: string;

    @Column ({type: 'varchar',name: 'telefone',length: 15})
    telefone!: string;
}