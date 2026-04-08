// @mostajs/cloud-config — Module registration
// Author: Dr Hamid MADANI drmdh@msn.com

import { moduleInfo, getSchemas } from './lib/module-info.js'

export const cloudConfigRegistration = {
  name: moduleInfo.name,
  label: moduleInfo.label,
  description: moduleInfo.description,
  version: moduleInfo.version,
  priority: 5,
  getSchemas,
}
