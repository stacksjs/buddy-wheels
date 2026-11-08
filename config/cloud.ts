import type { CloudConfig } from '@stacksjs/types'
import type { CloudConfig as TsCloudConfig } from '@stacksjs/ts-cloud'

const slug = 'buddy-wheels'
const domain = 'buddywheels.org'
// Verified free on the attached host on November 7, 2026. Each tenant owns its pair.
const webPort = 3460
const apiPort = 3468
const runtime = {
  HOST: '127.0.0.1',
  APP_ENV: 'production',
  NODE_ENV: 'production',
  APP_NAME: 'Buddy Wheels',
  APP_URL: `https://${domain}`,
  APP_DOMAIN: domain,
  STACKS_DEFAULT_ROUTES: 'none',
  STACKS_MODEL_APIS: 'none',
  DB_CONNECTION: 'sqlite',
  DB_DATABASE: `/var/lib/${slug}/buddy-wheels.sqlite`,
  DB_DATABASE_PATH: `/var/lib/${slug}/buddy-wheels.sqlite`,
  DB_SNAPSHOT_PATH: `/var/lib/${slug}/db-snapshot`,
  MAIL_MAILER: 'log',
}

/** Independent tenant; the Stacks host never checks out this application's source. */
export const tsCloud: TsCloudConfig = {
  project: { name: slug, slug, region: 'us-east-1' },
  stateDir: 'storage/cloud',
  cloud: { provider: 'hetzner', attachTo: 'stacks' },
  mode: 'server',
  environments: {
    production: { type: 'production', deployBranch: 'main', region: 'us-east-1', variables: { APP_ENV: 'production', NODE_ENV: 'production', LOG_LEVEL: 'info' } },
  },
  infrastructure: {
    dns: { provider: 'porkbun', domain },
    compute: { instances: 1, size: 'small', disk: { size: 20, type: 'ssd', encrypted: true }, webServer: 'rpx', proxy: { engine: 'rpx', onDemandTls: true } },
  },
  sites: {
    main: {
      root: '.', path: '/', domain,
      start: 'bun node_modules/@stacksjs/buddy/dist/serve-entry.js',
      port: webPort,
      preStart: [
        'bun install --frozen-lockfile',
        `mkdir -p /var/lib/${slug}/db-snapshot`,
        'bun node_modules/@stacksjs/buddy/dist/cli.js migrate --no-generate',
        'bun node_modules/@stacksjs/buddy/dist/cli.js seed-catalog',
      ],
      env: { ...runtime, PORT_API: String(apiPort), API_URL: `http://127.0.0.1:${apiPort}` },
    },
    api: {
      root: '.',
      start: 'bun node_modules/@stacksjs/actions/dist/serve/api.js',
      port: apiPort,
      preStart: ['bun install --frozen-lockfile'],
      env: { ...runtime },
    },
    www: { domain: `www.${domain}`, path: '/', redirect: { to: `https://${domain}`, preservePath: true } },
  },
}

const config: CloudConfig = {}
export default config
