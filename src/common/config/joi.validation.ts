import * as Joi from 'joi'

export const JoinValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
    PORT: Joi.number().default(3000),
    DB_NAME: Joi.string().required(),
    DB_USER_NAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    BCRYPT_SALT_ROUNDS: Joi.number().default(10),
    JWT_SECRET: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required()
})