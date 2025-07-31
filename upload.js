export default function handler(request, response) {
  if (request.method === 'POST') {
    response.status(200).send('OK');
  } else {
    response.status(405).send('Method Not Allowed');
  }
}
