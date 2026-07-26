import { createApp } from './app'
import { createContainer } from './di/container'
import { D1IncidentRepository } from './infrastructure/d1/d1-incident-repository'
import type { Bindings } from './types'

export default createApp((env) => {
  const bindings = env as Bindings
  return createContainer(new D1IncidentRepository(bindings.DB))
})
