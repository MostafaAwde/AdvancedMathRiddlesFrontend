const urls = {
  app: {
    validateToken: 'validate-token'
  },
  riddles: {
    get: `get-riddles`, 
    checkAnswer: `check-answer`,
  },
  dashboard: {
    getTopPlayers: `get-top-players`,
  },
  manageAccount: {
    updatePassword: `update-password`,
    updateUsername: `update-username`,
    delete: `delete-account`
  },
  signupLogin: {
    post: `signup`,
    get: `login`
  },
  passwordReset: {
    get: `validate-password-reset-token`,
    update: `reset-password`
  },
  forgotPassword: {
    sendPasswordReset: `send-password-reset`,
  },
  activateAccount: {
    activateAccount: `activate-account`
  }
};

export default urls;
