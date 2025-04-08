import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Link from '#card/models/link'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//   uids: ['email'],
//   passwordColumnName: 'password',
// })

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string | null

  @column()
  declare displayName: string | null

  @column()
  declare email: string

  @column()
  declare bannerUrl: string

  @column()
  declare avatarUrl: string

  @column()
  declare metaImgUrl: string

  @column()
  declare description: string | null

  @column()
  declare status: string | null

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  // @column({ serializeAs: null })
  // declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
