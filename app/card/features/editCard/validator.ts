import vine from '@vinejs/vine'

export const editCardValidator = vine.compile(
  vine.object({
    id: vine.number(),
    username: vine.string(),
    displayName: vine.string(),
    description: vine.string().optional(),
    status: vine.string().nullable(),
    avatar: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'gif'], size: '50mb' }).optional(),
    banner: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'gif'], size: '50mb' }).optional(),
    details: vine
      .object({
        x: vine.number(),
        y: vine.number(),
        width: vine.number(),
        height: vine.number(),
      })
      .optional(),
    links: vine
      .array(
        vine.object({
          userId: vine.number(),
          label: vine.string(),
          url: vine.string().url(),
        })
      )
      .optional(),
  })
)

export const deleteLinkValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    linkId: vine.number(),
  })
)
