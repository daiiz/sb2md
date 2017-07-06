// yarn run test -- -o --watch
const test = require('ava')
const tools = require('tools')

const url1 = 'https://gyazo.com/58870f2ba49fb883b0ae36185b12e89a'
const url2 = 'https://gyazo.com/4e57f815fc6dc2e54336399c6e9d109a/raw'
const url3 = 'https://i.gyazo.com/317624460f68314cfe3bfc2b8ee87dff.gif'
const url4 = 'https://i.gyazo.com/4e57f815fc6dc2e54336399c6e9d109a.png'
const url5 = 'https://avatars0.githubusercontent.com/u/4409909'

test('detectGyazoId', t => {
  t.is(tools.detectGyazoId(url1), '58870f2ba49fb883b0ae36185b12e89a')
  t.is(tools.detectGyazoId(url2), '4e57f815fc6dc2e54336399c6e9d109a')
  t.is(tools.detectGyazoId(url3), '317624460f68314cfe3bfc2b8ee87dff')
  t.is(tools.detectGyazoId(url4), '4e57f815fc6dc2e54336399c6e9d109a')
  t.is(tools.detectGyazoId(url5), null)
})

test('willDownloadGyazoUrls', t => {
  const gyazoId1 = tools.detectGyazoId(url1)
  const gyazoId2 = tools.detectGyazoId(url2)
  const list = [
    `%%IMAGE; ${gyazoId1}; ${url1}`,
    `%%IMAGE; ${gyazoId2}; ${url2}`
  ]
  let res = tools.willDownloadGyazoUrls(list, [tools.detectGyazoId(url1)])
  t.is(res.length, 1)
  t.is(res[0], url2)

  res = tools.willDownloadGyazoUrls(list, [tools.detectGyazoId(url3)])
  t.is(res.length, 2)
  t.is(res.indexOf(`https://gyazo.com/${gyazoId1}/raw`) !== -1, true)
  t.is(res.indexOf(`https://gyazo.com/${gyazoId2}/raw`) !== -1, true)
})
