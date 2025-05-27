import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  { ignores: ['components/ui/**'] },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: { 'no-console': 'error', 'vue/html-self-closing': 'off' },
  },
)
