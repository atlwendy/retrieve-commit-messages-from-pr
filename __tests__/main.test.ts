import Message = require('../src/message-retrieve')

test('should return false if no matched string', async () => {
  const message = new Message.MessageRetrieved(
    'master',
    'retrieve-commit-messages-from-pr',
    'https://github.com/atlwendy/retrieve-commit-messages-from-pr.git',
    '****'
  )
  // Test change
  await expect(message.execute()).resolves.toBeFalsy()
})
