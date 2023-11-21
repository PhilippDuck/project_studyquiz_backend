/**
 * Löscht alle Dokumente aus der collection "playedQuizzes". Hilfsfunktion zu Entwicklungszwecken
 */

exports = async function(payload) {
  const mongo = context.services.get("mongodb-atlas");
  const playedQuizzesCollection = mongo.db("project-studyquiz").collection("playedQuizzes");

  // Löschen aller Dokumente in der playedQuizzes Sammlung
  const result = await playedQuizzesCollection.deleteMany({});

  // Rückgabe der Anzahl der gelöschten Dokumente
  return { deletedCount: result.deletedCount };
};
