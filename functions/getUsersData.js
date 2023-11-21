/**
 * Gibt Benutzerdaten aller Nutzer zurück.
 */

exports = async function() {
  const mongodb = context.services.get("mongodb-atlas");
  const usersCollection = mongodb.db("project-studyquiz").collection("custom_userData");
  const users = await usersCollection.find({}).toArray();
  
  return users;
};
