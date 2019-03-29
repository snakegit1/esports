var env = 'dev'

if (window.location.hostname.indexOf('appspot.com') > 0) {
  env = 'staging'
} else if (window.location.hostname.indexOf('esportsleague.gg') > 0) {
  env = 'prod'
}

export const defaultUsername = env === 'prod' ? '' : 'admin@esportsleague.com'
export const defaultPassword = env === 'prod' ? '' : 'blahblahblahblah'

export function webUrl() {
  return window.location.protocol + "//" + window.location.host + '/app/';
}

export function apiUrl() {
  return {
    'dev': 'http://localhost:8080',
    // 'dev': 'https://eleague-be-dot-yfix-esl-dev.appspot.com',
    'staging': 'https://eleague-be-dot-yfix-esl-dev.appspot.com',
//    'staging': 'https://eleague-be-dot-sacred-catfish-180704.appspot.com',
    'prod': 'https://api.esportsleague.gg',
  }[env]
}

export function googleLoginUrl() {
  return {
    'dev': 'https://ealsignup.e1.loginrocket.com/auth/ap_0vW0fymgg3D5or4Cf6BQVi',
    'staging': 'https://ealsignup.e1.loginrocket.com/auth/ap_0vW0fymgg3D5or4Cf6BQVi',
    'prod': 'https://ealsignup-prod.e1.loginrocket.com/auth/ap_0vW0g4Lc3kItH1aRA9UW8E',
  }[env]
}

export function facebookLoginUrl() {
  return {
    'dev': 'https://ealsignup.e1.loginrocket.com/auth/ap_0vV0SVAu4oiqxwkXAT09L3',
    'staging': 'https://ealsignup.e1.loginrocket.com/auth/ap_0vV0SVAu4oiqxwkXAT09L3',
    'prod': 'https://ealsignup-prod.e1.loginrocket.com/auth/ap_0vW0yqoKKy8rITOxZRM7pL',
  }[env]
}
