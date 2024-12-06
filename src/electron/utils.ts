export function isDev(): boolean {
  console.log('node_env: ', process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development'
}
