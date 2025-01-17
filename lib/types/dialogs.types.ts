export interface OpenAlertOptions {
  title: string
  message: string
  confirmLabel?: string
  shouldCloseOnEscapePress?: boolean
  shouldCloseOnOverlayClick?: boolean
}

export type OpenConfirmOptions = OpenAlertOptions & {
  cancelLabel?: string
  intent?: 'primary' | 'positive' | 'negative'
}

export interface OpenCustomWidgetOptions {
  id?: string
  width?: number | 'small' | 'medium' | 'large' | 'fullWidth'
  minHeight?: number | string
  allowHeightOverflow?: boolean
  position?: 'center' | 'top'
  title?: string
  shouldCloseOnOverlayClick?: boolean
  shouldCloseOnEscapePress?: boolean
  parameters?: Object
}

export interface EntityDialogOptions {
  locale?: string
  contentTypes?: string[]
  min?: number
  max?: number
}

export interface DialogsAPI {
  /** Opens a simple alert window (which can only be closed). */
  openAlert: (options: OpenAlertOptions) => Promise<boolean>
  /** Opens a confirmation window. A user can either confirm or cancel the dialog. */
  openConfirm: (options: OpenConfirmOptions) => Promise<boolean>
  /** Opens a prompt window. A user can either provide a string input or cancel the dialog. */
  openPrompt: (
    options: OpenConfirmOptions & {
      defaultValue?: string
    }
  ) => Promise<string | boolean>
  /** Opens an extension in a dialog. */
  openExtension: (options: OpenCustomWidgetOptions) => Promise<any>
  /** Opens the current app in a dialog */
  openCurrentApp: (options?: Omit<OpenCustomWidgetOptions, 'id'>) => Promise<any>
  /** Opens the current app or extension in a dialog */
  openCurrent: (
    options?: Omit<OpenCustomWidgetOptions, 'id'> | OpenCustomWidgetOptions
  ) => Promise<any>
  /** Opens a dialog for selecting a single entry. */
  selectSingleEntry: <T = Object>(options?: {
    locale?: string
    contentTypes?: string[]
  }) => Promise<T | null>
  /** Opens a dialog for selecting multiple entries. */
  selectMultipleEntries: <T = Object>(options?: {
    locale?: string
    contentTypes?: string[]
    min?: number
    max?: number
  }) => Promise<T[] | null>
  /** Opens a dialog for selecting a single asset. */
  selectSingleAsset: <T = Object>(options?: {
    locale?: string
    mimetypeGroups?: string[]
  }) => Promise<T | null>
  /** Opens a dialog for selecting multiple assets. */
  selectMultipleAssets: <T = Object>(options?: {
    locale?: string
    min?: number
    max?: number
    mimetypeGroups?: string[]
  }) => Promise<T[] | null>
}
