import { AfterInsert, BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Password } from "./password.entity";

@Entity()
export class WebsiteDetail {

    constructor(url: string) {
        this.websiteUrl = url
    }

    @PrimaryColumn()
    websiteUrl: string

    @Column('text', {
        nullable: true
    })
    title: string

    @OneToMany(
        () => Password,
        (Passsword) => Passsword.websiteDetails
    )
    passwords: Password[]
    
    @Column('text', {
        nullable: true
    })
    icon: string

    @BeforeInsert()
    async afterInsert() {
        console.log(this.websiteUrl);
        this.icon = `https://logo.clearbit.com/${this.websiteUrl}`
        
    }

}