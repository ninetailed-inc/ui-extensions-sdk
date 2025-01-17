import {
  ContentType,
  EditorInterface,
  SpaceMembership,
  Role,
  ContentTypeField,
  Metadata,
  Entry,
  Task,
  Asset,
} from './entities'
import { EntryAPI } from './entry.types'
import { SpaceAPI } from './space.types'
import { WindowAPI } from './window.types'
import { ContentEntitySys, Link } from './utils'
import { FieldAPI } from './field-locale.types'
import { DialogsAPI } from './dialogs.types'
import { AppConfigAPI } from './app.types'
import { NavigatorAPI } from './navigator.types'
import { EntryFieldInfo, FieldInfo } from './field.types'
import { Adapter } from 'contentful-management/types'

/* User API */

export interface UserAPI {
  sys: {
    id: string
    type: string
  }
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  // Although called SpaceMembership, this type does not abide to entity
  // with same name. Keeping it the same (with more precise types) for
  // backwards compatibility
  spaceMembership: {
    sys: Pick<SpaceMembership['sys'], 'id' | 'type'>
    admin: SpaceMembership['admin']
    roles: Pick<Role, 'name' | 'description'>[]
  }
}

/* Locales API */
export interface LocalesAPI {
  /** The default locale code for the current space. */
  default: string
  /** A list of locale codes of all locales available for editing in the current space. */
  available: string[]
  /** An object with keys of locale codes and values of corresponding human-readable locale names. */
  names: { [key: string]: string }
  /** An object with keys of locale codes and values of corresponding fallback locale codes. If there's no fallback then the value is undefined. */
  fallbacks: { [key: string]: string | undefined }
  /** An object with keys of locale codes and values of corresponding boolean value indicating if the locale is optional or not. */
  optional: { [key: string]: boolean }
  /** An object with keys of locale codes and values of corresponding information indicating if the locale is right-to-left or left-to-right language. */
  direction: { [key: string]: 'ltr' | 'rtl' }
}

/* Notifier API */

export interface NotifierAPI {
  /** Displays a success notification in the notification area of the Web App. */
  success: (message: string) => void
  /** Displays an error notification in the notification area of the Web App. */
  error: (message: string) => void
}

/* Location API */

export interface LocationAPI {
  /** Checks the location in which your app is running */
  is: (type: string) => boolean
}

/* Parameters API */

export interface ParametersAPI {
  installation: Object
  instance: Object
  invocation?: Object
}

/* IDs */

export interface IdsAPI {
  user: string
  extension?: string
  app?: string
  space: string
  environment: string
  environmentAlias?: string
  field: string
  entry: string
  contentType: string
}

/** Content API */
export interface ContentTypeAPI {
  sys: {
    id: string
    type: 'ContentType'
    revision: number
    space: Link<'Space', 'Link'>
    environment: Link<'Environment', 'Link'>
    createdAt?: string
    updatedAt?: string
  }
  fields: ContentTypeField[]
  name: string
  displayField: string
  description: string
}

export interface EditorLocaleSettings {
  mode: 'multi' | 'single'
  focused?: string
  active?: Array<string>
}

export interface SharedEditorSDK {
  editor: {
    editorInterface: EditorInterface
    onLocaleSettingsChanged: (callback: (value: EditorLocaleSettings) => any) => Function
    onShowDisabledFieldsChanged: (callback: (value: boolean) => any) => Function
  }
  /** Allows to read and update the value of any field of the current entry and to get the entry's metadata */
  entry: EntryAPI
  /** Information about the content type of the entry. */
  contentType: ContentTypeAPI
}

export type CrudAction = 'create' | 'read' | 'update' | 'delete'
export type PublishableAction = 'publish' | 'unpublish'
export type ArchiveableAction = 'archive' | 'unarchive'
export type JSONPatchItem = {
  op: 'remove' | 'replace' | 'add'
  path: string
  value?: any
}
type PatchEntity = Entry | Task | Asset

export interface AccessAPI {
  can(action: 'read' | 'update', entity: 'EditorInterface' | EditorInterface): Promise<boolean>

  can<T = Object>(
    action: CrudAction,
    entity: 'ContentType' | ContentType | 'Asset' | 'Entry' | T
  ): Promise<boolean>

  can<T = Object>(
    action: PublishableAction,
    entity: 'ContentType' | ContentType | 'Asset' | 'Entry' | T
  ): Promise<boolean>

  can<T = Object>(action: ArchiveableAction, entity: 'Asset' | 'Entry' | T): Promise<boolean>

  can(action: 'update', entity: PatchEntity, patch: JSONPatchItem[]): Promise<boolean>

  /** Whether the current user can edit app config */
  canEditAppConfig: () => Promise<boolean>
}

type EntryScopedIds = 'field' | 'entry' | 'contentType'

export interface BaseExtensionSDK {
  /** @deprecated since version 4.0.0 consider using the CMA instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  space: SpaceAPI
  /** Information about the current user and roles */
  user: UserAPI
  /** Information about the current locales */
  locales: LocalesAPI
  /** Methods for opening UI dialogs: */
  dialogs: DialogsAPI
  /** Methods for navigating between entities stored in a Contentful space. */
  navigator: NavigatorAPI
  /** Methods for displaying notifications. */
  notifier: NotifierAPI
  /** Exposes app configuration parameters */
  parameters: ParametersAPI
  /** Exposes method to identify app's location */
  location: LocationAPI
  /** Exposes methods for checking user's access level */
  access: AccessAPI
  /** Exposes relevant ids, keys may be ommited based on location */
  ids: Omit<IdsAPI, EntryScopedIds>
  /** Adapter to be injected in contentful-management client */
  cmaAdapter: Adapter
}

export type EditorExtensionSDK = Omit<BaseExtensionSDK, 'ids'> &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: Omit<IdsAPI, 'field'>
  }

export type SidebarExtensionSDK = Omit<BaseExtensionSDK, 'ids'> &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: Omit<IdsAPI, 'field'>
    /** Methods to update the size of the iframe the app is contained within.  */
    window: WindowAPI
  }

export type FieldExtensionSDK = BaseExtensionSDK &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: IdsAPI
    /** Gives you access to the value and metadata of the field the app is attached to. */
    field: FieldAPI
    /** Methods to update the size of the iframe the app is contained within.  */
    window: WindowAPI
  }

export type DialogExtensionSDK = Omit<BaseExtensionSDK, 'ids'> & {
  /** A set of IDs for the app */
  ids: Omit<IdsAPI, EntryScopedIds>
  /** Closes the dialog and resolves openCurrentApp promise with data */
  close: (data?: any) => void
  /** Methods to update the size of the iframe the app is contained within.  */
  window: WindowAPI
}

export type PageExtensionSDK = Omit<BaseExtensionSDK, 'ids'> & {
  /** A set of IDs actual for the app */
  ids: Omit<IdsAPI, EntryScopedIds>
}

export type AppExtensionSDK = Omit<BaseExtensionSDK, 'ids'> & {
  /** A set of IDs actual for the app */
  ids: Omit<IdsAPI, EntryScopedIds | 'extension' | 'app'> & { app: string }
  app: AppConfigAPI
}

export type KnownSDK =
  | FieldExtensionSDK
  | SidebarExtensionSDK
  | DialogExtensionSDK
  | EditorExtensionSDK
  | PageExtensionSDK
  | AppExtensionSDK

export interface Locations {
  LOCATION_ENTRY_FIELD: 'entry-field'
  LOCATION_ENTRY_FIELD_SIDEBAR: 'entry-field-sidebar'
  LOCATION_ENTRY_SIDEBAR: 'entry-sidebar'
  LOCATION_DIALOG: 'dialog'
  LOCATION_ENTRY_EDITOR: 'entry-editor'
  LOCATION_PAGE: 'page'
  LOCATION_APP_CONFIG: 'app-config'
}

export interface ConnectMessage {
  id: string
  location: Location[keyof Location]
  parameters: ParametersAPI
  locales: LocalesAPI
  user: UserAPI
  initialContentTypes: ContentType[]
  ids: IdsAPI
  contentType: ContentTypeAPI
  editorInterface?: EditorInterface
  entry: {
    sys: ContentEntitySys
    metadata?: Metadata
  }
  fieldInfo: EntryFieldInfo[]
  field?: FieldInfo
}
