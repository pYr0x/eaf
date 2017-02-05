define(function() {
  return {
    languages: [
    ],
    nonLanguages: [
      {name: "English", code: "en"},
      {name: "Français", code: "fr"}
    ],
    server: {
      domain: "http://easyappframework.com",
      sockets: "ws://easyappframework.com/ws/"
    },
    webSockets: false,
    general: {
      hasPhone: false,
      phoneMask: '+1(###) ###-####',
      hasBlog: false,
      hasFAQs: true,
      hasSubUsers: false,
      hasAPI: false,
      hasChat: false,
      usernameMinLength: 4,
      securityAnswerMinLength: 4
    }
  }
});