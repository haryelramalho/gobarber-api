export default {
  jwt: {
    // colocando '' por que nos testes não podemos ter secret vazio
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '1d',
  },
};
