const pageId = '453799681310067';
const accessToken = 'EAAZAYJd1naCoBO1JZCrjj5SreLqfFtOZCtFT1wtWgZCLjusJThbAatDIKUDKqsMUBAh0ZCs4Q0cZC0YY6qn25zArmYeDZA2vqIXpd3Qq1ZCpuyZBraasw9kvspX2PNne50meT6kTT6JYLUYnGXgkU9QGN7rJc8vAORdZAKuyDDyA73OfiZAqWxxj9VlOWZBOgOLucJnu';
const baseUri = ' `https://graph.facebook.com/v22.0` ';

async function test() {
  const urlFeed = `${baseUri.replace(/[`'"]/g, '').trim()}/${pageId}/feed?access_token=${accessToken}&fields=message,full_picture,created_time,permalink_url&limit=4`;
  console.log('Fetching', urlFeed);
  try {
    let res = await fetch(urlFeed);
    console.log(res.status, await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();