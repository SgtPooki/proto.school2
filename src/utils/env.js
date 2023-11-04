export let isProduction = false

if (!import.meta.env.SSR && typeof window !== 'undefined' && window.location != undefined) {
  isProduction = typeof window !== 'undefined' && window &&
    window.location.hostname === 'proto.school'
}
