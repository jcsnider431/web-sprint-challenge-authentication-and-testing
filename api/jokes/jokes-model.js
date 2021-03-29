const db = require("../../data/dbConfig.js");

module.exports = {
  add, 
  findBy, 
  checkUsers
};

function findBy(filter) {
  return db("users as u")
    .select("u.id", "u.username", "u.password")
    .where(filter);
}

async function checkUsers(name){
  return db('users')
  .where('users.username', name)
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return db("users as u")
  .select("u.id", "u.username", "u.password")
  .where("u.id", id)
  .first();
}