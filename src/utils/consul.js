const Consul = require("consul");

class ConsulConfig {
  constructor() {
    // init consul
    this.consul = new Consul({
      host: "127.0.0.1",
      port: 8500,
      promisify: true,
      //secure: false,
    });
    this.register();
  }

  register() {
    const serviceName = "consul-demo";
    // register serveice and health check
    this.consul.agent.service.register(
      {
        name: serviceName,
        address: "localhost",
        port: 3000,
        check: {
          http: `http://localhost:3000/health`,
          interval: "10s",
          timeout: "5s",
        },
      },
      function (err, result) {
        if (err) {
          console.error(err);
          throw err;
        }

        console.log(serviceName + " registered");
      }
    );
  }

  async listAllServices() {
    const result = await this.consul.agent.service.list();

    if (!result) {
      throw new Error("error");
    }

    return result;
  }

  async getConfig(key) {
    const result = await this.consul.kv.get(key);
    console.log(result);

    if (!result) {
      return Promise.reject(key + "not exist");
    }

    return JSON.parse(result.Value);
  }

  // get user config
  async getUserConfig(key) {
    const result = await this.getConfig("develop/user");

    if (!key) {
      return result;
    }

    return result[key];
  }

  // update user
  async setUserConfig(key, val) {
    const user = await this.getConfig("develop/user");

    user[key] = val;

    return this.consul.kv.set("develop/user", JSON.stringify(user));
  }
}

module.exports = ConsulConfig;
