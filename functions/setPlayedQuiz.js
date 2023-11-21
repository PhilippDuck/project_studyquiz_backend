/**
 * Erhalte ein gespieltes Spiel als Objekt und füge es der "playedQuizzes" Collection hinzu.
 */

exports = async function(payload) {
  // Der übergebene Payload sollte als JSON im Body vorliegen
  const data = payload;

  // Überprüfen, ob Daten vorhanden sind
  if (!data) {
    return { status: 'missing data' };
  }

  // MongoDB-Service und die richtige Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const playedQuizzesCollection = mongodb.db("project-studyquiz").collection("playedQuizzes");
  const quizzesCollection = mongodb.db("project-studyquiz").collection("quizzes");
  const customUserDataCollection = mongodb.db("project-studyquiz").collection("custom_userData");

  try {
    // Prüfen, ob der Spieler das Quiz heute bereits gespielt hat
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const playedToday = await playedQuizzesCollection.findOne({
      playerId: data.playerId,
      quizId: data.quizId,
      endTime: { $gte: today.getTime() }
    });
    
    // Daten in die Collection playedQuizzes einfügen
    await playedQuizzesCollection.insertOne(data);

    if (playedToday) {
      return { status: 'already_played' };
    }

    // Prüfen, ob es nicht das vom Spieler selbst erstellte Quiz ist
    const quiz = await quizzesCollection.findOne({ _id: BSON.ObjectId(data.quizId) });
    if (quiz && quiz.owner == data.playerId) {
      return { status: 'own_quiz' };
    }

    

    // Punkte dem Spieler gutschreiben
    await customUserDataCollection.updateOne(
      { userId: data.playerId },
      { $inc: { points: data.points } }
    );

    return { status: 'success', data: data };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}
