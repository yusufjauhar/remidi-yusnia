import { Sequelize } from "sequelize";

const db = new Sequelize('railway', 'root', 'koiFAdqXJLlnypfpFWquiCggAugkGAWF', {
  host: 'monorail.proxy.rlwy.net',
  port: 39771,
  dialect: "mysql"
});

export default db;
