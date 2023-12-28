import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WebsiteDetail } from "./websiteDetail.entity";

@Entity('passwords')
export class Password {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        nullable: false
    })
    title: string

    @Column('text', {
        nullable: true
    })
    websiteUrl: string

    @Column('text', {
        nullable: true
    })
    userNameEmail: string
    
    @Column('text', {
        nullable: false
    })
    password: string

    @ManyToOne(
        () => User,
        (User) => User.password,
        {
            eager: false,
        }
    )
    user: User
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @ManyToOne(
        () => WebsiteDetail,
        (WebsiteDetail) => WebsiteDetail.websiteUrl,
        {
            eager: true,
            cascade: true
        }
    )
    websiteDetails: WebsiteDetail
}
