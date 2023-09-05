import db from "./database.js";

const migration = async () => {
  try {
    await db.query(
      `
        CREATE TABLE IF NOT EXISTS activities (
          id int NOT NULL AUTO_INCREMENT,
          title varchar(255) NOT NULL,
          email varchar(255) NOT NULL,
          created_at datetime NOT NULL DEFAULT current_timestamp(),
          updated_at datetime NOT NULL DEFAULT current_timestamp(),
          primary key (id)
        )
      `
    );

    await db.query(
      `
        CREATE TABLE IF NOT EXISTS todos (
          id int NOT NULL AUTO_INCREMENT,
          activity_group_id int NOT NULL,
          title varchar(255) NOT NULL,
          priority varchar(255) NOT NULL,
          created_at datetime NOT NULL DEFAULT current_timestamp(),
          updated_at datetime NOT NULL DEFAULT current_timestamp(),
          primary key (id)
        )
      `
    )
  } catch (error) {
    throw error;
  }
};

export default migration;