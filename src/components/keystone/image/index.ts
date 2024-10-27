import {
  type BaseListTypeInfo,
  fieldType,
  type FieldTypeFunc,
  type CommonFieldConfig,
} from '@keystone-6/core/types'
import { graphql } from '@keystone-6/core'
import { del, put } from '@vercel/blob'
import { GraphQLError, GraphQLScalarType } from 'graphql'
import imageSize from 'image-size'

export async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}
export type ImageFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo> & {
    db?: {
      extendPrismaSchema?: (field: string) => string
    }
  }
type ImageData = {
  src: string
  height: number
  width: number
  filesize: number
  extension: string
  url: string
  id: string
}
const FileScalar = new GraphQLScalarType({
  name: 'File',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value
  },
  parseLiteral(node) {
    throw new GraphQLError('Upload literal unsupported.', { nodes: node })
  },
  serialize() {
    throw new GraphQLError('Upload serialization unsupported.')
  },
})
const ImageFieldInput = graphql.inputObject({
  name: 'ImageFieldInput',
  fields: {
    upload: graphql.arg({
      type: graphql.nonNull(graphql.scalar<File>(FileScalar)),
    }),
  },
})

const inputArg = graphql.arg({ type: ImageFieldInput })

const ImageFieldOutput = graphql.object<ImageData>()({
  name: 'ImageFieldOutput',
  fields: {
    id: graphql.field({ type: graphql.nonNull(graphql.ID) }),
    filesize: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    width: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    height: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    extension: graphql.field({ type: graphql.nonNull(graphql.String) }),
    url: graphql.field({ type: graphql.nonNull(graphql.String) }),
  },
})

async function getImageMetadataFromBuffer(buffer: Buffer) {
  const fileType = await (await import('file-type')).fileTypeFromBuffer(buffer)
  if (!fileType) {
    throw new Error('File type not found')
  }

  const { ext: extension } = fileType
  if (
    extension !== 'jpg' &&
    extension !== 'png' &&
    extension !== 'webp' &&
    extension !== 'gif'
  ) {
    throw new Error(`${extension} is not a supported image type`)
  }

  const { height, width } = imageSize(buffer)
  if (width === undefined || height === undefined) {
    throw new Error('Height and width could not be found for image')
  }

  return { width, height, filesize: buffer.length, extension }
}

async function inputResolver(data: graphql.InferValueFromArg<typeof inputArg>) {
  if (data === null || data === undefined) {
    return {
      pathname: data,
      contentType: data,
      contentDisposition: data,
      url: data,
      filesize: data,
      width: data,
      height: data,
    }
  }
  const buffer = await streamToBuffer(data.upload.stream())
  const { width, height } = await getImageMetadataFromBuffer(buffer)
  const blob = await put(data.upload.name, buffer, {
    access: 'public',
  })
  return {
    ...blob,
    contentType: blob.contentType,
    filesize: data.upload.size,
    width,
    height,
  }
}

export const image =
  <ListTypeInfo extends BaseListTypeInfo>(
    config: ImageFieldConfig<ListTypeInfo>,
  ): FieldTypeFunc<ListTypeInfo> =>
  (meta) => {
    if ('isIndexed' in config) {
      throw Error(
        "isIndexed: 'unique' is not a supported option for field type image",
      )
    }

    return fieldType({
      kind: 'multi',
      extendPrismaSchema: config.db?.extendPrismaSchema,
      fields: {
        filesize: { kind: 'scalar', scalar: 'Int', mode: 'optional' },
        pathname: { kind: 'scalar', scalar: 'String', mode: 'optional' },
        width: { kind: 'scalar', scalar: 'Int', mode: 'optional' },
        height: { kind: 'scalar', scalar: 'Int', mode: 'optional' },
        contentType: { kind: 'scalar', scalar: 'String', mode: 'optional' },
        contentDisposition: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional',
        },
        url: { kind: 'scalar', scalar: 'String', mode: 'optional' },
      },
    })({
      ...config,
      hooks: {
        ...config.hooks,
        async beforeOperation(args) {
          await config.hooks?.beforeOperation?.(args)
          if (args.operation === 'update' || args.operation === 'delete') {
            const pathnameKey = `${meta.fieldKey}_pathname`
            const pathname = args.item[pathnameKey]
            const urlKey = `${meta.fieldKey}_url`
            const url = args.item[urlKey]

            // This will occur on an update where an image already existed but has been
            // changed, or on a delete, where there is no longer an item
            if (
              (args.operation === 'delete' ||
                typeof args.resolvedData[meta.fieldKey].id === 'string' ||
                args.resolvedData[meta.fieldKey].id === null) &&
              typeof pathname === 'string' &&
              typeof url === 'string'
            ) {
              await del(url)
            }
          }
        },
      },
      input: {
        create: {
          arg: inputArg,
          resolve: (data) => inputResolver(data),
        },
        update: {
          arg: inputArg,
          resolve: (data) => inputResolver(data),
        },
      },
      output: graphql.field({
        type: ImageFieldOutput,
        resolve({
          value: {
            pathname,
            contentType,
            contentDisposition,
            url,
            height,
            width,
            filesize,
          },
        }) {
          if (
            pathname === null ||
            contentType === null ||
            contentDisposition === null ||
            url === null ||
            height === null ||
            width === null ||
            filesize === null
          ) {
            return null
          }
          return {
            src: url,
            height,
            width,
            filesize,
            extension: pathname.split('.').pop() || '',
            url: url,
            id: pathname,
          }
        },
      }),
      __ksTelemetryFieldTypeName: '@opensaasau/vercel-image',
      views: '@keystone-6/core/fields/types/image/views',
    })
  }
