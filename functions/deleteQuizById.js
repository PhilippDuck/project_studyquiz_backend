/**
 * Erhält eine Quiz ID. Passendes Quiz wird in "quizzes" Collection gesucht und gelöscht.
 */

exports = async function(payload) {
  const inputData = JSON.parse(payload);
  
  if (!inputData.id) {
    return { success: false, error: "Keine ID im Input-Daten angegeben." };
  }

  // MongoDB-Service und Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const myCollection = mongodb.db("project-studyquiz").collection("quizzes");

  // Quiz anhand der ID löschen
  try {
    const result = await myCollection.deleteOne({ _id: BSON.ObjectId(inputData.id) });

    if (result.deletedCount === 0) {
      return { success: false, error: "Kein Quiz mit der angegebenen ID gefunden." };
    }

    return { success: true, deletedId: inputData.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
