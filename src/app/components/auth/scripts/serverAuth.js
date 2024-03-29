
const config = require("./config");

async function createHydraClientIfNecessary() {
    let adminUrl = config.OAUTH2_ADMIN_URL;
    if (!adminUrl.endsWith("/")) adminUrl = `${adminUrl}/`;

    const getClientResponse = await fetch(`${adminUrl}clients/${config.OAUTH2_CLIENT_ID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (![200, 404].includes(getClientResponse.status)) {
      logger.error(await getClientResponse.text());
      throw new Error(`Could not get Hydra client [${getClientResponse.status}]`);
    }

    if (getClientResponse.status === 200) {
      // Update the client to be sure it has the latest config
      logger.info("Updating Hydra client...");

      const updateClientResponse = await fetch(`${adminUrl}clients/${config.OAUTH2_CLIENT_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storefrontHydraClient)
      });

      if (updateClientResponse.status === 200) {
        logger.info("OK: Hydra client updated");
      } else {
        logger.error(await updateClientResponse.text());
        throw new Error(`Could not update Hydra client [${updateClientResponse.status}]`);
      }
    } else {
      logger.info("Creating Hydra client...");

      const response = await fetch(`${adminUrl}clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storefrontHydraClient)
      });

      switch (response.status) {
        case 200:
        // intentional fallthrough!
        // eslint-disable-line no-fallthrough
        case 201:
          logger.info("OK: Hydra client created");
          break;
        case 409:
          logger.info("OK: Hydra client already exists");
          break;
        default:
          logger.error(await response.text());
          throw new Error(`Could not create Hydra client [${response.status}]`);
      }
    }
  }

  module.exports = { createHydraClientIfNecessary };
