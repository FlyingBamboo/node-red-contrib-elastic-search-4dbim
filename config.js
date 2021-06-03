module.exports = function (RED) {
  function esClientConfig(n) {
    RED.nodes.createNode(this, n);
    this.host = n.host;
    this.port = n.port;
    this.protocol = n.protocol;
    this.username = n.username;
    this.password = n.password;
  }
  RED.nodes.registerType("es client config", esClientConfig);
};
