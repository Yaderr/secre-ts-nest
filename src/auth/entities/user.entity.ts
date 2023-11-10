import { Password } from "src/passwords/entities/password.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    fullName: string
    
    @Column({
        type: 'text',
        unique: true,
        nullable: false
    })
    email: string

    @Column({
        type: 'text',
        select: false,
    })
    password: string

    @Column('text',{ nullable: false })
    randomkey: string

    @Column('boolean', { default: true })
    isActive: boolean

    @OneToMany(
        () => Password,
        (Password) => Password.user
    )

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}