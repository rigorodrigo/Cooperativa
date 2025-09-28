import { Column, Double, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Saca } from './Saca'

@Entity ({name: 'Culturas'})
export class Cultura {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column ({type: 'varchar', length: 15, unique: true})
    nome!: string;

    @Column ({type: 'decimal', precision: 8, scale: 2, nullable: false})
    valor_saca!: number;

    @OneToMany (() => Saca, (saca) => saca.cultura)
    sacas!: Saca[];
}