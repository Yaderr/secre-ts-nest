import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { cardType } from "../interface";
import { User } from "src/auth/entities/user.entity";

@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', { nullable: false })
    title: string

    @Column('numeric', { nullable: false })
    number: number

    @Column('date', { nullable: false })
    expire: Date

    @Column('numeric', { nullable: false })
    sec_code: number

    @Column('enum', { nullable: false, enum: cardType })
    type: cardType

    @ManyToOne(
        () => User,
        (User) => User.id,
        {
            nullable: false
        }
    )
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
