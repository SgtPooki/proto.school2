export const tutorialRedirectModal = {
  referrer: {
    SEARCH_ENGINES: [
      { id: 'google', url: 'google.com' },
      { id: 'bing', url: 'bing.com' },
      { id: 'yahoo', url: 'yahoo.com' },
      { id: 'baidu', url: 'baidu.com' },
      { id: 'aol', url: 'aol.com' },
      { id: 'yandex', url: 'yandex.com' },
      { id: 'duckduckgo', url: 'duckduckgo.com' },
      { id: 'ecosia', url: 'ecosia.org' },
      { id: 'qwant', url: 'qwant.com' }
    ]
  }
}

export const MAILCHIMP_API_URL = import.meta.env.VUE_APP_MAILCHIMP_API_URL
export const MAILCHIMP_USER_ID = import.meta.env.VUE_APP_MAILCHIMP_USER_ID
export const MAILCHIMP_LIST_ID = import.meta.env.VUE_APP_MAILCHIMP_LIST_ID
export const DOMAIN = 'https://proto.school'

export default {
  MAILCHIMP_API_URL,
  MAILCHIMP_USER_ID,
  MAILCHIMP_LIST_ID,
  tutorialRedirectModal
}
