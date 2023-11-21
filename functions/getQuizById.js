/**
 * Gibt ein Quiz anhand der übergeben id zurück
 */

exports = function(payload) {
  // ID aus dem Payload extrahieren
  const quizId = payload.id;

  // Überprüfen Sie, ob die quizId bereitgestellt wurde
  if (!quizId) {
    throw new Error("Quiz ID is required");
  }

  // Das Quiz mit der entsprechenden ID aus der Datenbank abrufen
  const quiz = context.services
    .get("mongodb-atlas")
    .db("project-studyquiz")
    .collection("quizzes")
    .findOne({ _id: new BSON.ObjectId(quizId) });

  return quiz;
};
