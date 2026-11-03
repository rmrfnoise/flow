import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'dist')
const target = join(root, 'android', 'app', 'src', 'main', 'assets', 'public')

if (!existsSync(join(source, 'index.html'))) {
  throw new Error('dist/index.html is missing; run "npm run build" first')
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })
console.log(`Synced ${source} -> ${target}`)
