import { hashSync } from 'bcrypt'

export const initialData = {
    users: [
        {
            fullName: "Jesus Patino",
            email: "jesus@gmail.com",
            password: hashSync("_U&31$Oc9GO?AN1v9Xi-", +process.env.BCRYPT_SALT_ROUNDS)
        }
    ],
    password: [
        {
            title: "Gmail",
            websiteUrl: "www.gmail.com",
            userNameEmail: "name@gmail.com",
            password: "123123132132313231"
        }
    ]
}