/**
 * Löscht Benutzerdaten anhand einer UserId. Wird beim löschen eines Nutzers getriggert.
 */

exports = async function(authEvent) {
  
   const userId = authEvent.user.id;
  // Zugriff auf die MongoDB-Collection über Realm
  const mongodb = context.services.get("mongodb-atlas");
  const customUserDataCollection = mongodb.db("project-studyquiz").collection("custom_userData");
  const quizzesCollection = mongodb.db("project-studyquiz").collection("quizzes");
  const playedQuizzesCollection = mongodb.db("project-studyquiz").collection("playedQuizzes");

  try {
    // Löschen des Benutzerdokuments aus der 'custom_userData'-Collection
    await customUserDataCollection.deleteOne({ userId: userId });

    // Löschen aller vom Benutzer erstellten Quizze aus der 'quizzes'-Collection
    await quizzesCollection.deleteMany({ owner: userId });

    // Löschen aller vom Benutzer gespielten Spiele aus der 'playedQuizzes'-Collection
    await playedQuizzesCollection.deleteMany({ playerId: userId });

    return `Alle zugehörigen Daten für den Benutzer mit der ID ${userId} wurden gelöscht.`;
  } catch (error) {
    return `Fehler beim Löschen der Benutzerdaten: ${error}`
    throw error;
  }
};
