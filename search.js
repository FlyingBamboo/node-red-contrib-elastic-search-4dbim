const { Client } = require("@elastic/elasticsearch");

function searchPromise(client, index, body) {
  return new Promise((resolve, reject) => {
    client.search(
      {
        index: index,
        body: body,
      },
      (err, { body }) => {
        if (err) reject(err);
        else resolve(body);
      }
    );
  });
}

module.exports = function (RED) {
  function DoElasticSearch(config) {
    RED.nodes.createNode(this, config);

    let c = RED.nodes.getNode(config.client);

    let clientConfig = {
      node: `${c.protocol}://${c.host}:${c.port}`,
      auth: {
        username: c.username,
        password: c.password,
      }
    };
    if (c.protocol == 'https') {
      clientConfig.ssl = {
        ca: c.cert,
        rejectUnauthorized: false,
      };
    };
    const client = new Client(clientConfig);

    var node = this;
    node.on("input", function (msg) {
      searchPromise(client, msg.index, msg.payload)
        .then((body) => {
          msg.payload = body;
          node.send(msg);
        })
        .catch((err) => {
          msg.payload = err;
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("es search", DoElasticSearch);
};
