import { publishStudioFamilyAssets } from './StudioDownloads'
export { studioAssemblyInstructions as xlAssemblyInstructions, studioDownload as xlDownload } from './StudioDownloads'
export async function publishXLAssets(root: string): Promise<void> { await publishStudioFamilyAssets(root, 'XL') }
