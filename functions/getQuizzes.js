/**
 * Gibt alle verfügbaren QuizObjekte zurück
 */

exports = async function(payload) {
  const mongo = context.services.get("mongodb-atlas");
  const quizzesCollection = mongo.db("project-studyquiz").collection("quizzes");
  const userDataCollection = mongo.db("project-studyquiz").collection("custom_userData");
  const playedQuizzesCollection = mongo.db("project-studyquiz").collection("playedQuizzes");

  const playerId = context.user.id;  // Die ID des aktuell authentifizierten Benutzers

  // Sicherstellen, dass playerId vorhanden ist
  if (!playerId) {
    return { status: 'error', message: 'No authenticated user' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quizzes = await quizzesCollection.find({}).toArray();
  
  for(let i = 0; i < quizzes.length; i++) {
    const ownerData = await userDataCollection.findOne({ userId: quizzes[i].owner });
    quizzes[i].ownerNick = ownerData ? ownerData.nickname : "Unbekannt";

    // Überprüfen, ob das Quiz heute vom Spieler gespielt wurde
    const playedToday = await playedQuizzesCollection.findOne({
      playerId: playerId,
      quizId: quizzes[i]._id.toString(), // Falls _id ein ObjectId ist, muss er zu einem String konvertiert werden
      endTime: { $gte: today.getTime() }
    });

    quizzes[i].todayPlayed = !!playedToday;  // Wird true oder false sein
  }
  
  return quizzes;
};
