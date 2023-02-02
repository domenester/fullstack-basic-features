import { ConfigModule } from '@nestjs/config'
import { DynamicModule } from '@nestjs/common'

export const ConfigModuleForRoot = (): DynamicModule => {
  const {NODE_ENV} = process.env
  return ConfigModule.forRoot({
    envFilePath: NODE_ENV ? `${process.cwd()}/.env.${NODE_ENV}` : `${process.cwd()}/.env`,
    isGlobal: true
  })
}